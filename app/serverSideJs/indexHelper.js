const msgSent = require('./../models/chatMsg');
const chatboxHelper = require('./chatboxHelper');
const registerHelper = require('./registerHelper');

async function updateSocketID(userName, authToken, socketID) {
    let authVerified = await chatboxHelper.verifyAuthToken(userName, authToken);
    if (authVerified == "correct") {
        await chatboxHelper.socketIDUpdate(userName, socketID);
        return "done"
    } else {
        return "notDone"
    }

}

async function insertChatData(data) {
    var timeStamp = new Date();

    if (data.from != "" && data.to != "" && data.message != "" && data.authToken != "" && data.socketID != "") {
    
    }else{
        return "dataForm incorrect"
    }
    
    const newMessage = new msgSent({
        from: data.from,
        to: data.to,
        message: data.message,
        timeStamp: timeStamp
    });

    let fromProfile = await registerHelper.findProfile(newMessage.from);
    let toProfile = await registerHelper.findProfile(newMessage.to);
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
            //helperFun.socketIDUpdate(newMessage.from,req.body.socketID);
            chatboxHelper.insertData(usr1and2,newMessage);
            return ["doneOld",usr1and2];
            //res.status(200).json({ pro: "Chatwindow exists" });
        } else {
            let chatW = new chatWindow({
                user1:usr1,
                user2:usr2,
                usr12:usr1and2
            });
            let profileUpdateStateFrom = await chatboxHelper.updateProfile(newMessage.from,usr1and2);
            let profileUpdateStateTo = await chatboxHelper.updateProfile(newMessage.to,usr1and2);
            let collectionCreationState = await chatboxHelper.createCollections(usr1and2);
            let chatWindowCollUpdateState = await chatboxHelper.chatWindowCollectionUpdate(chatW);
            let dataInsertState = await chatboxHelper.insertData(usr1and2,newMessage);
            console.log("Chatwindow does not exists created new collection");
            ["doneNew",usr1and2]
        }

    } else {
        //res.status(200).json({ pro: "Reciever profile does not exists" });
        return "errChat";
    }
        return "errDataUpload";
}

async function findSocketID(userName, authToken, toUser) {
    let authVerified = await chatboxHelper.verifyAuthToken(userName, authToken);
    if (authVerified == "correct") {
        let socID = await chatboxHelper.findSocketID(toUser);
        return socID;
    } else {
        return "incorrect Auth Token"
    }
}

exports.updateSocketID = updateSocketID;
exports.insertChatData = insertChatData;
exports.findSocketID = findSocketID;