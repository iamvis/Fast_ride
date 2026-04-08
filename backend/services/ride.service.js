const rideModel= require('../models/ride.model');
const mapService = require('./maps.service');
const crypto = require('crypto');
const axios = require('axios');

function createHttpError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function getRazorpayAuth() {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw createHttpError('Razorpay credentials are not configured', 500);
    }

    return {
        username: process.env.RAZORPAY_KEY_ID,
        password: process.env.RAZORPAY_KEY_SECRET
    };
}

async function fetchRazorpayPayment(paymentId) {
    const response = await axios.get(
        `https://api.razorpay.com/v1/payments/${paymentId}`,
        {
            auth: getRazorpayAuth()
        }
    );

    return response.data;
}

async function markRidePaid({
    rideId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
}) {
    await rideModel.findByIdAndUpdate(rideId, {
        orderId: razorpay_order_id,
        paymentID: razorpay_payment_id,
        signature: razorpay_signature,
        paymentStatus: 'paid',
        paidAt: new Date()
    });

    return rideModel.findById(rideId).populate('user').populate('captain');
}

async function getFare(pickup , destination) {
    if(!pickup || !destination){
        throw new Error('Pickup and Destination are required');
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);
    const distanceKm = Math.max(distanceTime.distance / 1000, 1.2);
    const durationMin = Math.max(distanceTime.duration / 60, 5);
    const averageSpeed = distanceKm / Math.max(durationMin / 60, 0.1);

    const pricingConfig = {
        auto: {
            minimumFare: 70,
            baseFare: 28,
            perKmRate: 10.5,
            perMinuteRate: 1.8,
            bookingFee: 6,
            platformFee: 4
        },
        car: {
            minimumFare: 120,
            baseFare: 52,
            perKmRate: 16,
            perMinuteRate: 2.7,
            bookingFee: 10,
            platformFee: 8
        },
        moto: {
            minimumFare: 55,
            baseFare: 20,
            perKmRate: 8,
            perMinuteRate: 1.2,
            bookingFee: 4,
            platformFee: 3
        }
    };

    const trafficMultiplier =
        averageSpeed < 16 ? 1.18 :
        averageSpeed < 24 ? 1.1 :
        1;

    const longDistanceSurcharge = distanceKm > 12 ? (distanceKm - 12) * 3.5 : 0;
    const longDurationSurcharge = durationMin > 35 ? (durationMin - 35) * 1.4 : 0;

    const fare = Object.fromEntries(
        Object.entries(pricingConfig).map(([vehicleType, config]) => {
            const subtotal =
                config.baseFare +
                (distanceKm * config.perKmRate) +
                (durationMin * config.perMinuteRate) +
                config.bookingFee +
                config.platformFee +
                longDistanceSurcharge +
                longDurationSurcharge;

            const realisticFare = Math.max(config.minimumFare, subtotal * trafficMultiplier);
            const roundedFare = Math.ceil(realisticFare / 5) * 5;

            return [vehicleType, roundedFare];
        })
    );

    fare._meta = {
        distanceKm: Number(distanceKm.toFixed(1)),
        durationMin: Math.round(durationMin),
        trafficLabel: trafficMultiplier > 1.12 ? 'Heavy traffic pricing' : trafficMultiplier > 1 ? 'Moderate traffic pricing' : 'Standard pricing'
    };

    return fare;
}
module.exports.getFare = getFare;


//for otp generation
function getOtp(num){
    function generateOtp(num){
        const otp = crypto.randomInt(Math.pow(10, num-1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}

module.exports.createRide = async ({
    user, pickup, destination, vehicleType
}) =>{ 
    //velidating
    if(!user || !pickup || !destination || !vehicleType){
    throw new Error('All feild are required');
}

const fare = await  getFare(pickup, destination);
const ride = rideModel.create({ 
 user, 
 pickup,
 destination,
 otp:getOtp(6),
 fare: fare[vehicleType],
 paymentStatus: 'pending',
})

return ride;
}


//confirm ride

module.exports.confirmRide = async ({
    rideId, captain
}) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await rideModel.findOneAndUpdate({ _id: rideId }, {
        status: 'accepted',
        captain: captain._id
    }, { new: true })

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;

}


module.exports.startRide = async ({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ongoing'
    }, { new: true })

    return rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');
}

module.exports.endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    }, { new: true })

    return rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');
}

module.exports.createPaymentOrder = async ({ rideId, user }) => {
    const auth = getRazorpayAuth();

    const ride = await rideModel.findOne({
        _id: rideId,
        user: user._id
    }).populate('captain').populate('user');

    if (!ride) {
        throw createHttpError('Ride not found', 404);
    }

    if (ride.paymentStatus === 'paid') {
        throw createHttpError('Ride has already been paid', 409);
    }

    if (ride.status !== 'completed') {
        throw createHttpError('Payment is available after the ride is completed', 400);
    }

    const receipt = `ride_${ride._id}_${Date.now()}`.slice(0, 40);
    const amount = Math.round(Number(ride.fare) * 100);

    const response = await axios.post(
        'https://api.razorpay.com/v1/orders',
        {
            amount,
            currency: 'INR',
            receipt,
            notes: {
                rideId: String(ride._id),
                rider: ride.user?.fullname?.firstname || 'Rider'
            }
        },
        {
            auth
        }
    );

    await rideModel.findByIdAndUpdate(rideId, {
        orderId: response.data.id,
        paymentStatus: 'pending'
    });

    return {
        order: response.data,
        ride: await rideModel.findById(rideId).populate('user').populate('captain')
    };
};

module.exports.verifyPayment = async ({
    rideId,
    user,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
}) => {
    getRazorpayAuth();

    const ride = await rideModel.findOne({
        _id: rideId,
        user: user._id
    }).populate('user').populate('captain');

    if (!ride) {
        throw createHttpError('Ride not found', 404);
    }

    if (ride.paymentStatus === 'paid') {
        return ride;
    }

    if (ride.status !== 'completed') {
        throw createHttpError('Payment is available after the ride is completed', 400);
    }

    if (!ride.orderId) {
        throw createHttpError('Payment order has not been created for this ride', 400);
    }

    if (ride.orderId !== razorpay_order_id) {
        throw createHttpError('Payment order does not match this ride', 400);
    }

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature);
    const receivedBuffer = Buffer.from(razorpay_signature);

    if (
        expectedBuffer.length !== receivedBuffer.length ||
        !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
        await rideModel.findByIdAndUpdate(rideId, {
            paymentStatus: 'failed'
        });
        throw createHttpError('Payment verification failed', 400);
    }

    const payment = await fetchRazorpayPayment(razorpay_payment_id);
    const expectedAmount = Math.round(Number(ride.fare) * 100);

    if (payment.order_id !== razorpay_order_id) {
        throw createHttpError('Payment order does not match Razorpay payment details', 400);
    }

    if (payment.status !== 'captured' && payment.status !== 'authorized') {
        throw createHttpError('Payment has not been completed in Razorpay', 400);
    }

    if (payment.currency !== 'INR') {
        throw createHttpError('Invalid payment currency', 400);
    }

    if (Number(payment.amount) !== expectedAmount) {
        throw createHttpError('Invalid payment amount', 400);
    }

    return markRidePaid({
        rideId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    });
};

module.exports.handleRazorpayWebhook = async ({
    rawBody,
    signature
}) => {
    if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
        throw createHttpError('Razorpay webhook secret is not configured', 500);
    }

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature);
    const receivedBuffer = Buffer.from(signature || '');

    if (
        expectedBuffer.length !== receivedBuffer.length ||
        !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
        throw createHttpError('Invalid Razorpay webhook signature', 400);
    }

    const payload = JSON.parse(rawBody.toString('utf8'));

    if (payload.event !== 'payment.captured') {
        return { ignored: true };
    }

    const paymentEntity = payload.payload?.payment?.entity;
    const rideId = paymentEntity?.notes?.rideId;

    if (!paymentEntity?.id || !paymentEntity?.order_id || !rideId) {
        throw createHttpError('Incomplete Razorpay webhook payload', 400);
    }

    const ride = await rideModel.findById(rideId);

    if (!ride) {
        throw createHttpError('Ride not found', 404);
    }

    if (ride.paymentStatus === 'paid') {
        return { ignored: false, rideId: String(ride._id), alreadyPaid: true };
    }

    if (ride.orderId && ride.orderId !== paymentEntity.order_id) {
        throw createHttpError('Payment order does not match this ride', 400);
    }

    const expectedAmount = Math.round(Number(ride.fare) * 100);

    if (Number(paymentEntity.amount) !== expectedAmount) {
        throw createHttpError('Invalid payment amount', 400);
    }

    if (paymentEntity.currency !== 'INR') {
        throw createHttpError('Invalid payment currency', 400);
    }

    const updatedRide = await markRidePaid({
        rideId: ride._id,
        razorpay_order_id: paymentEntity.order_id,
        razorpay_payment_id: paymentEntity.id,
        razorpay_signature: signature
    });

    return { ignored: false, ride: updatedRide };
};
