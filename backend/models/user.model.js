const mongoose= require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');

const userSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3, 'first Name mustbe at least 3 characters'],
        },
        lastname:{
           type:String,
           minlength:[3, 'last Name must be at least 3 characters'],
        }
      
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:[5, 'email must be at least 5 characters'],

    },
    password:{
        type:String,
        required:true,
        select:false, // if user is selected then password will not go evry time
       
    },
    socketId:{
        type:String,
        

    }
})


//methods of user
//user token genarate
userSchema.methods.generateAuthToken = function(){
    //give the id and the key it will generate unique token for specific candidate
    const token = jwt.sign({_id:this._id},
         process.env.JWT_SECRET,
          {expiresIn:'24h'}) 
    return token;
}

//compare password by bcrypt
userSchema.methods.comparePassword = async function(password){
return await bcrypt.compare(password, this.password);
}

// Hashing a password means converting a plain text password into a 
// fixed-length, unique, and irreversible 
// string (called a hash) using a cryptographic hashing algorithm.
userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10)
}

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;
