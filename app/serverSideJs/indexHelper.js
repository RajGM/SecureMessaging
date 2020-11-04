const chatboxHelper = require('./chatboxHelper');

async function updateSocketID(userName, authToken, socketID) {
    console.log("Inside updateSocketID");
    console.log("userName:" + userName);
    console.log("authToken:" + authToken);
    console.log("socketID:" + socketID);

    //if auth equal then update socketID
    let authVerified = await chatboxHelper.verifyAuthToken(userName, authToken);
    if (authVerified == "correct") {
        await chatboxHelper.socketIDUpdate(userName, socketID);
        return "done"
    } else {
        return "notDone"
    }

}

async function insertChatData(data) {
    //userName, authToken, from, to, message
    console.log(data);
    return "data uploaded";
}

async function findSocketID(userName, authToken) {
    let authVerified = await chatboxHelper.verifyAuthToken(userName, authToken);
    if (authVerified == "correct") {
        let socketID = await chatboxHelper.verifySocketID(userName, socketID);
        return socketID
    } else {
        return ""
    }
}

exports.updateSocketID = updateSocketID;
exports.insertChatData = insertChatData;
exports.findSocketID = findSocketID;