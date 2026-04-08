const blacklistTokenModel = require('../models/blacklistToken.model');
const userModel = require('../models/user.model');
const userService = require ('../services/user.service');
const {validationResult} = require('express-validator')

//logic for user creation
module.exports.registerUser = async (req, res, next)=>{
    
   //validation response from express-validator
   const errors = validationResult(req); //for data/error
   if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
   } 
    
    //if all things working well then we invoke the usercreate
    //extracking 
    const {fullname, email, password} = req.body;

    //check if email is already exist
   const isUserExist= await userModel.findOne({email});
   if(isUserExist){
    return res.status(400).json({error: 'Email already exist'})
   }


    //hashing password
    const hashPassword = await userModel.hashPassword(password);

   const user = await userService.createUser({
    firstname:fullname.firstname,
    lastname:fullname.lastname,
    email,
    password: hashPassword,
   });

   //user token genertae
    const token  = user.generateAuthToken();
    res.status(201).json({token, user});

}

//logic for user login
module.exports.loginUser= async(req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    
    const {email, password}= req.body;
    
    
   

// By default, Mongoose does not return fields that are explicitly marked as "excluded" in the model schema (e.g., password might be excluded via select: false in the schema).
// The +password here overrides the default behavior, explicitly including the password field in the query result.
    const user =await userModel.findOne({email}).select('+password');
   
    
    if(!user){
        return res.status(401).json({message: 'Invalid Email or Password'});
    }
  //comparing
    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({message: 'Invalid Email or Password'});
    }
    
    //generate token
    const token = user.generateAuthToken();

    //setcookie token
    res.cookie('token', token);

    res.status(200).json({token, user});
}

//Logic for user Profile
module.exports.getUserProfile = async (req, res, next) =>{
    //need of middleware

    res.status(200).json(req.user)
}

//logic for user logout
module.exports.logoutUser = async (req, res, next) =>{
    res.clearCookie('token')
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
     
    await blacklistTokenModel.create({token});
     
     res.status(200).json({message: 'Logged out'})
}