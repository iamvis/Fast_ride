const { validationResult } = require("express-validator");
const rideService = require("../services/ride.service");
const mapService = require("../services/maps.service");
const { sendMessageToSocketId } = require("../socket");
const rideModel = require("../models/ride.model");

function getErrorStatus(err) {
  return err.statusCode || 500;
}


module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //destructuring the data  from request data
  const { userId, pickup, destination, vehicleType } = req.body;

  //try-catch
  try {
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });
    res.status(201).json(ride);
    //pickup coordinats
    const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
    console.log(pickupCoordinates);
    let captainInRadius = await mapService.getCaptainsInTheRadius(
      pickupCoordinates.ltd,
      pickupCoordinates.lng,
      10 // in km radius
    );
    if (!captainInRadius.length) {
      captainInRadius = await mapService.getOnlineCaptains();
    }
    ride.otp = "";

    //ridewitn user detail
    const rideWithUser = await rideModel
      .findOne({ _id: ride._id })
      .populate("user");

    captainInRadius.map((captain) => {
      sendMessageToSocketId(captain.socketId, {
        event: "new-ride",
        data: rideWithUser,
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//for fare
module.exports.getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //destructuring the data  from request data
  const { pickup, destination } = req.query;
  console.log(pickup);
  console.log(destination);

    // Validate input
    if (!pickup || !destination) {
      return res.status(400).json({ message: "Pickup and destination are required." });
    }

  //try-catch
  console.log(pickup);
  try {
    const fare = await rideService.getFare(pickup, destination);
    return res.status(200).json(fare);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//confrim ride controller
module.exports.confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.confirmRide({
      rideId,
      captain: req.captain,
    });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-confirmed",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports.startRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, otp } = req.query;

  try {
    const ride = await rideService.startRide({
      rideId,
      otp,
      captain: req.captain,
    });

    console.log(ride);

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-started",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.endRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.endRide({ rideId, captain: req.captain });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-ended",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.createPaymentOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const paymentOrder = await rideService.createPaymentOrder({
      rideId,
      user: req.user,
    });

    return res.status(200).json(paymentOrder);
  } catch (err) {
    return res.status(getErrorStatus(err)).json({ message: err.message });
  }
};

module.exports.verifyPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    rideId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  try {
    const ride = await rideService.verifyPayment({
      rideId,
      user: req.user,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(getErrorStatus(err)).json({ message: err.message });
  }
};

module.exports.handleRazorpayWebhook = async (req, res) => {
  try {
    const result = await rideService.handleRazorpayWebhook({
      rawBody: req.body,
      signature: req.headers["x-razorpay-signature"],
    });

    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(getErrorStatus(err)).json({ message: err.message });
  }
};
