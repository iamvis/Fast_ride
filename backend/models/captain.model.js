const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');

const captainSchema = new mongoose.Schema({
    fullname :{
        firstname:{
            type: String,
            required: true,
            minlength:[3, 'First Name must be at least 3 characters'],
        },
        lastname:{
            type:String,
            minlength:[3, 'Last Name must be at least 3 characters'],
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        match:[/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password:{
        type:String,
        required: true,
        select:false,
    },
     
    socketId:{
        type:String,
         
    },

    status:{
        type:String,
        enum:['active', 'inactive'],
        default:'inactive'
    },
    vehicle:{
        color:{
            type:String,
            required:true,
            minlenght:[3,'color must be at least 3 characters']
        },
        plate:{
            type:String,
            required:true,
            minlength:[3,'plate must be at least 3 characters']
        },
        capacity:{
            type:Number,
            required:true,
            min:[1,'capacity must be at least 1 ']
        },
        vehicletype:{
            type:String,
            required:true,
            enum:['car', 'motorcycle', 'auto']
        }
    },
    location:{
        ltd:{
            type:Number

        },
        lng:{
            type:Number

        }
    }
})

//method for generating toke
captainSchema.methods.generateAuthToken = function (){
    const token = jwt.sign({_id:this._id}, process.env.JWT_SECRET, {expiresIn:'24h'});
   return token;
}

// method fro comapre password
captainSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

//hash password
captainSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10)
}

const captainModel = mongoose.model('captain', captainSchema)

module.exports = captainModel;
