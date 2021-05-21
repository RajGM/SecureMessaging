//Schema definition for chat messages

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatMsg = new Schema({
    from:{
        type:String,
        required:true,
    },
    to:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:true
    },
    timeStamp:{
        type:String,
        required:true
    }
});

module.exports = msg = mongoose.model("message",chatMsg);