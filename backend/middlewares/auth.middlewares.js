const userModel = require('../models/user.model')
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');
const blacklistTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model')

//authantication of user
//cheking user by token or header

//logic for authUser
module.exports.authUser = async (req, res, next)=>{
    //extracking token from cookies and header (have to use splite froM only geting token)
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];
   
    //checking token present in cookies or in  headers
    if(!token){
        return res.status(401).json({message: 'Unauthorized'});
    }


    //checking blacklisted token in db  //not implemented here, this is just an example.
    const isBlacklisted = await blacklistTokenModel.findOne({token: token});
    if(isBlacklisted){
        return res.status(401).json({message: 'Unauthorized'});
    }

    //decoded by try and catch
    try{
        //verifying token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);
        if(!user){
            return res.status(401).json({message:'Unauthorized'});
        }
        req.user = user;
        return next();
    }catch(err){
        return res.status(401).json({message:'Unauthorized'})
    }
}


//authantication of captain
//cheking captain by token or header

//logic for authCaptain
module.exports.authCaptain = async(req, res, next) =>{
    //extracking token from cookies and header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    //cehking token present in cookies
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }

    //cheking blacklist toekn  present in db or not
    const isBlacklisted = await blacklistTokenModel.findOne({token: token})
    if(isBlacklisted){
        return res.status(401).json({message:"Unauthorized"});
    }

    //decoded by try and catch
    try{
        //verifying token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id)
        if(!captain){
            return res.status(401).json({message:"Unauthorized"});
        }
        req.captain = captain;
        return next();
    }catch(err){
        console.log(err);
        return res.status(401).json({message:"Unauthorized"});
    }
}
