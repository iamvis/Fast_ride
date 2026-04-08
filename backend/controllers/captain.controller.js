const blacklistTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model')
const rideModel = require('../models/ride.model')
const captainService = require('../services/captain.service')
const {validationResult} = require('express-validator')




module.exports.registerCaptain = async (req, res, next )=>{
    //validation response from express-validator
    //erorr handle from express-validator
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})

    }


    //get data from requeest BODY
    const {fullname, email, password, vehicle}= req.body;

    //check if email is already exist
   const isCaptainExist= await captainModel.findOne({email});
   if(isCaptainExist){
    return res.status(400).json({message: 'Captain already exist'})
   }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname:fullname.firstname,
        lastname: fullname.lastname,
        email,
        password:hashedPassword,
        color:vehicle.color,
        plate:vehicle.plate,
        vehicletype:vehicle.vehicletype,
        capacity:vehicle.capacity
    });

    //generate token 
    const token = captain.generateAuthToken();
    //send response
    res.status(201).json({ token, captain})
}









module.exports.loginCaptain = async (req, res, next) =>{
    //validation response from express-validator
    //erorr handle from express-validator
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    console.log();
    //get data from requeest BODY
    const {email, password}= req.body;

    
// By default, Mongoose does not return fields that are explicitly marked as "excluded" in the model schema (e.g., password might be excluded via select: false in the schema).
// The +password here overrides the default behavior, explicitly including the password field in the query result.
const captain =await captainModel.findOne({email}).select('+password');

if(!captain){
   
    return res.status(400).json({message:'Invalid Email or Password'})
}

//comparing
    const isMatch = await captain.comparePassword(password)
    if(!isMatch){
        return res.status(400).json({message: 'Invalid Email or Password'})
    }

    //generate token
    const token = await captain.generateAuthToken();

    //set cookie token
    res.cookie ('token', token);
    res.status(200).json({token,captain})
}


module.exports.getCaptainProfile = async(req, res, next)=>{
    const captainId = req.captain._id;

    const [stats] = await rideModel.aggregate([
        {
            $match: {
                captain: captainId,
                status: 'completed'
            }
        },
        {
            $group: {
                _id: null,
                totalEarnings: { $sum: '$fare' },
                completedTrips: { $sum: 1 }
            }
        }
    ]);

    res.status(200).json({
        ...req.captain.toObject(),
        stats: {
            totalEarnings: stats?.totalEarnings || 0,
            completedTrips: stats?.completedTrips || 0,
        }
    })
}


module.exports.logoutCaptain= async(req, res, next)=>{
    //remove cookie from session
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    await blacklistTokenModel.create({token});
    res.status(200).json({message: 'Logged out'})
}
