const chatMessage = require('./../models/chatMsg');
const chatWindow = require('./../models/chatWindow');

async function createCollections(name) {
    var MongoClient = require('mongodb').MongoClient;
    const configFile = require('./../../myUrl');
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    let creationState;

    try {
        const db = client.db('testdb');
        let returnData = await db.createCollection(name)
            .catch(err => console.log(err));
        if (returnData) {
            //console.log("Collection created:", returnData);
            creationState = "collectionCreated";
        } else {
            console.log("Some went wrong");
            creationState = "errorCreation";
        }
    }
    catch (err) {
        console.log(err);
    } finally {
        client.close();
    }

    return creationState;
}

async function insertData(name, data) {
    var MongoClient = require('mongodb').MongoClient;
    const configFile = require('./../../myUrl');
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    let insertionState;

    try {
        const db = client.db("testdb").collection(name);
        let returnData = await db.insertOne(data)
            .catch(err => {
                console.log(err);
            })
        if (returnData) {
            console.log("Data inserted" + returnData);
            insertionState = "dataInserted";
        } else {
            console.log("Something went wrong during data insertion");
            insertionState = "errorInsertion";
        }
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }

    return insertionState;
}

async function updateProfile(userName, chatboxName) {
    var MongoClient = require('mongodb').MongoClient;
    const configFile = require('./../../myUrl');
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));
    let updationState;

    try {
        const db = client.db("testdb").collection("userprofiles");
        let returnData = await db.updateOne({ userName: userName },
            {
                $push: { "chatWindow": chatboxName }
            })
            .catch(err => {
                console.log(err);
            });
        if (returnData) {
            console.log("Profile Updated:" + returnData);
            updationState = "profileUpdated";
        } else {
            console.log("Something went wrong during profile updation");
            updationState = "errorUpdation";
        }
    } catch (err) {
        console.log("Profile updation error:" + err);
    } finally {
        client.close();
    }

    return updationState;
}

async function chatWinowFinder(windowName) {
    let MongoClient = require('mongodb').MongoClient;
    const configFile = require('./../../myUrl');
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    let dataArr;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    try {
        const db = client.db('testdb').collection("chatboxes");

        dataArr = await db.find({ usr12: windowName }, { projection: { "_id": 0 } })
            .toArray();
    }
    catch (err) {
        console.log(err);
    } finally {
        client.close();
    }

    //console.log(typeof dataArr);
    if (Object.keys(dataArr).length === 0) {
        console.log("blank");
        return "notExists"
    } else {
        console.log("Something found");
        console.log(dataArr[0].usr12);
        return "exists";
    }
}

async function chatWindowCollectionUpdate(data) {
    var MongoClient = require('mongodb').MongoClient;
    const configFile = require('./../../myUrl');
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    let chatWindowCollectionState;

    try {
        const db = client.db("testdb").collection("chatboxes");
        let returnData = await db.insertOne(data)
            .catch(err => {
                console.log(err);
            })
        if (returnData) {
            console.log("Data inserted" + returnData);
            chatWindowCollectionState = "dataInserted";
        } else {
            console.log("Something went wrong during data insertion");
            chatWindowCollectionState = "errorInsertion";
        }
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }

    return chatWindowCollectionState;
}

async function socketIDUpdate(userName, socketID) {

    var MongoClient = require('mongodb').MongoClient;
    const configFile = require('./../../myUrl');
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));
    let updationState;

    try {
        const db = client.db("testdb").collection("sockettoken");
        //        dataArr = await db.updateOne({ userName: userName }, { $set: { authToken: "ABCDEFG", authExpire: "Soon2Expire" } }, { upsert: true, useFindAndModify: false });

        let returnData = await db.updateOne({ userName: userName },{$set:{socketID:socketID}},{ upsert: true, useFindAndModify: false });
        if (returnData) {
            //console.log("socketID Updated:" + returnData);
            updationState = "socketIDupdated";
        } else {
            console.log("Something went wrong during profile updation");
            updationState = "errorSocketUpdate";
        }
    } catch (err) {
        console.log("Profile updation error:" + err);
    } finally {
        client.close();
    }

    return updationState;

}

async function verifyAuthToken(userName, authToken) {
    let MongoClient = require('mongodb').MongoClient;
    const configFile = require('./../../myUrl');
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    let dataArr;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    console.log("Values in verifyAuthToken function");
    console.log("userName:" + userName + " authToken:" + authToken);
    try {
        const db = client.db('testdb').collection("authtokens");
        dataArr = await db.find({ userName }, { projection: { "_id": 0 } })
            .toArray();
    }
    catch (err) {
        console.log(err);
    } finally {
        client.close();
    }

    console.log(typeof dataArr);
    console.log("dataArr", dataArr);
    if (Object.keys(dataArr).length === 0) {
        console.log("blank");
        return "notExists"
    } else {
        if (authToken == dataArr[0].authToken) {
            return "correct";
        } else {
            return "incorrect";
        }
    }

}

async function findSocketID(userName, socketID) {
    let MongoClient = require('mongodb').MongoClient;
    const configFile = require('./../../myUrl');
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    let dataArr;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    console.log("Values in verifyAuthToken function");
    console.log("userName:" + userName + " socketID:" + socketID);
    try {
        const db = client.db('testdb').collection("sockettoken");
        dataArr = await db.find({ userName }, { projection: { "_id": 0 } })
            .toArray();
    }
    catch (err) {
        console.log(err);
    } finally {
        client.close();
    }

    console.log(typeof dataArr);
    console.log("dataArr", dataArr);
    if (Object.keys(dataArr).length === 0) {
        console.log("blank");
        return "notExists"
    } else {
        return dataArr[0].socketID;
    }

}

async function callME() {
    let collectionName = "testtest2";
    let userName = "test404";
    //let collCreationState = await createCollections(collectionName);
    //console.log("Collection Creation State:" + collCreationState);
    /*
    const newMessage = new chatMessage({
        from:"test",
        to:"test2",
        message:"Date.getTime() test",
        timeStamp: Date()
    });
    let dataInsertion = await insertData(collectionName,newMessage);
    console.log("Message insertion state:"+dataInsertion);
    */
    //let updationState = await updateProfile(userName, collectionName);
    //console.log("Updation State:"+updationState);
    //let chatWindowFinderState = await chatWinowFinder(collectionName);
    //console.log("chatWindowFinderState:" + chatWindowFinderState);
    const cW = new chatWindow({
        user1: "test2",
        user2: "test404",
        usr12: "test2test404"
    });
    let chatWindowCollState = await chatWindowCollectionUpdate(cW);
    console.log("chatWindowState:" + chatWindowCollState);
}

//callME();

exports.createCollections = createCollections;
exports.insertData = insertData;
exports.updateProfile = updateProfile;
exports.chatWinowFinder = chatWinowFinder;
exports.chatWindowCollectionUpdate = chatWindowCollectionUpdate;
exports.socketIDUpdate = socketIDUpdate;
exports.verifyAuthToken = verifyAuthToken;
exports.findSocketID = findSocketID;