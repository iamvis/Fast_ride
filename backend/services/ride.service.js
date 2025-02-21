const rideModel= require('../models/ride.model');
const mapService = require('./maps.service');
const crypto = require('crypto');


async function getFare(pickup , destination) {
    if(!pickup || !destination){
        throw new Error('Pickup and Destination are required');

        
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination)
 console.log(distanceTime)

    const baseFare = {
        auto: 20,
        car: 30,
        moto: 15
    };

    const perKmRate = {
        auto: 7,
        car: 8,
        moto:6
    };

    const perMinuteRate = {
        auto: 1.2,
        car: 1.5,
        moto:1.0
    };


    // Extract distance (meters) and duration (seconds)
    const distanceKm = distanceTime.distance / 1000; // Convert meters to kilometers
    const durationMin = distanceTime.duration / 60;  // Convert seconds to minutes

    // Calculate fare for each vehicle type
    const fare = {
        auto: Math.round(baseFare.auto + (distanceKm * perKmRate.auto) + (durationMin * perMinuteRate.auto)),
        car: Math.round(baseFare.car + (distanceKm * perKmRate.car) + (durationMin * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + (distanceKm * perKmRate.moto) + (durationMin * perMinuteRate.moto))
    };

  console.log(fare);
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
 fare: fare[vehicleType]
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
    })

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
    })

    return ride;
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
    })

    return ride;
}