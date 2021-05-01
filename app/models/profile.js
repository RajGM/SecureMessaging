const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    userName:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    isProfessionalEmailUsed:{
        type:Boolean,
        default:false
    },
    chatWindow:[{type:String}]
});

module.exports = Profile = mongoose.model("userProfile",ProfileSchema);