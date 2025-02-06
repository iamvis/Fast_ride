const express = require('express')
const route = express.Router();
const { body } = require('express-validator')
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




module.exports = router;