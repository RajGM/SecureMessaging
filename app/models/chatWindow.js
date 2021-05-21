//Schema definition for chat Window

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    user1:{
        type:String,
        required:true
    },
    user2:{
        type:String,
        required:true
    },
    usr12:{
        type:String,
        required:true
    }
});

module.exports = chatWindow = mongoose.model("chatBox",chatSchema);