const express = require('express')
const router = express.Router();
const { body, query } = require('express-validator')
const rideController = require('../controllers/ride.controller')
const authMiddleware = require('../middlewares/auth.middlewares')




router.post('/create',

    //validation comfirmAtion
    authMiddleware.authUser,
    body('pickup').isString().isLength({min:3}).withMessage('Invalid PickUp Address'),
    body('destination').isString().isLength({min:3}).withMessage('Invalid Destination Address'),
    body('vehicleType').isString().isIn(['auto', 'car', 'moto']).withMessage('Invalid VehicleType'),
   // if untill here program commese then we create the the ride 
   rideController.createRide

)

router.get('/get-fare',
    authMiddleware.authUser,
    query('pickup').isString().isLength({min:3}).withMessage('Invalid PickUp Address'),
    query('destination').isString().isLength({min:3}).withMessage('Invalid Destination Address'),
    rideController.getFare
)

router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.confirmRide
)

router.get('/start-ride',
    authMiddleware.authCaptain,
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    rideController.startRide
)

router.post('/end-ride',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.endRide
)

router.post('/payment-order',
    authMiddleware.authUser,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.createPaymentOrder
)

router.post('/verify-payment',
    authMiddleware.authUser,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    body('razorpay_order_id').isString().notEmpty().withMessage('Invalid Razorpay order id'),
    body('razorpay_payment_id').isString().notEmpty().withMessage('Invalid Razorpay payment id'),
    body('razorpay_signature').isString().notEmpty().withMessage('Invalid Razorpay signature'),
    rideController.verifyPayment
)

router.post('/razorpay/webhook',
    rideController.handleRazorpayWebhook
)



module.exports = router;
