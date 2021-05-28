//import helper functions
const msgSent = require('./../models/chatMsg');
const chatboxHelper = require('./chatboxHelper');
const registerHelper = require('./registerHelper');

//calls relevant helper functions to update socketID after authentication is being verified
async function updateSocketID(userName, authToken, socketID) {
    let authVerified = await chatboxHelper.verifyAuthToken(userName, authToken);
    if (authVerified == "correct") {
        await chatboxHelper.socketIDUpdate(userName, socketID);
        return "done";
    } else {
        return "notDone";
    }

}

//calls relevant helper funtions to check for authentication and for inserting data into DB 
async function insertChatData(data,mongoClient) {
    var timeStamp = new Date();

    if (data.from != "" && data.to != "" && data.message != "" && data.authToken != "" && data.socketID != "") {
    
    }else{
        return "dataForm incorrect";
    }
    
    const newMessage = new msgSent({
        from: data.from,
        to: data.to,
        message: data.message,
        timeStamp: timeStamp
    });

    let fromProfile = await registerHelper.findUserName(newMessage.from,mongoClient);
    let toProfile = await registerHelper.findUserName(newMessage.to,mongoClient);
    if (toProfile == "exists" && fromProfile == "exists") {
        var usr1;
        var usr2;
        var usr1and2;
        if (data.to > data.from) {
            usr1 = data.from;
            usr2 = data.to;
        } else {
            usr1 = data.to;
            usr2 = data.from;
        }
        usr1and2 = usr1 + usr2;

        let chatboxState = await chatboxHelper.chatWinowFinder(usr1and2);
        
        if (chatboxState == "exists") {
            chatboxHelper.insertData(usr1and2,newMessage);
            return ["doneOld",usr1and2];
        } else {
            
            let chatW = {
                user1:usr1,
                user2:usr2,
                usr12:usr1and2
            };

            let profileUpdateStateFrom = await chatboxHelper.updateProfile(newMessage.from,usr1and2);
            let profileUpdateStateTo = await chatboxHelper.updateProfile(newMessage.to,usr1and2);
            let collectionCreationState = await chatboxHelper.createCollections(usr1and2);
            let chatWindowCollUpdateState = await chatboxHelper.chatWindowCollectionUpdate(chatW);
            let dataInsertState = await chatboxHelper.insertData(usr1and2,newMessage);
            ["doneNew",usr1and2]
        }

    } else {
        return "errChat";
    }
        return "errDataUpload";
}

//calls relevant funtions to find socketID for realtime communications
async function findSocketID(userName, authToken, toUser,mongoClient) {
    let authVerified = await chatboxHelper.verifyAuthToken(userName, authToken, mongoClient);
    if (authVerified == "correct") {
        let socID = await chatboxHelper.findSocketID(toUser);
        return socID;
    } else {
        return "incorrect Auth Token"
    }
}

//export all of the functions
exports.updateSocketID = updateSocketID;
exports.insertChatData = insertChatData;
exports.findSocketID = findSocketID;