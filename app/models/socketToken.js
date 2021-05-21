//Schema definition for socket token storage

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    userName:{
        type:String,
        require:true
    },
    socketID:{
        type:String,
        require:true
    },
});

module.exports = socketT = mongoose.model("socketToken",ProfileSchema);