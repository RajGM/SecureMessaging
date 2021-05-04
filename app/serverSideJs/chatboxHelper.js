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

async function verifyAuthToken(userName, authToken) {
    let MongoClient = require('mongodb').MongoClient;
    const configFile = require('./../../myUrl');
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    let dataArr;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

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

    if (Object.keys(dataArr).length === 0) {
        console.log("blank");
        return "notExists"
    } else {
        console.log("PASSED AUTHTOKEN:"+authToken);
        console.log("DB AUTHTOKEN:"+dataArr[0].authToken);
        if (authToken == dataArr[0].authToken) {
            return "correct";
        } else {
            return "incorrect";
        }
    }

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
        
        let returnData = await db.updateOne({ userName: userName }, { $set: { socketID: socketID } }, { upsert: true, useFindAndModify: false });
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

async function findSocketID(userName) {
    let MongoClient = require('mongodb').MongoClient;
    const configFile = require('./../../myUrl');
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    let dataArr;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    //console.log("Values in verifyAuthToken function");
    //console.log("userName:" + userName + " socketID:" + socketID);
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

    // console.log(typeof dataArr);
    // console.log("dataArr", dataArr);
    if (Object.keys(dataArr).length === 0) {
        // console.log("blank");
        return "notExists"
    } else {
        return dataArr[0].socketID;
    }

}

async function getCollectionNames(userName) {

    const configFile = require('./../../myUrl');
    let MongoClient = require('mongodb').MongoClient;
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    let dataArr;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    try {
        const db = client.db('testdb').collection("userprofiles");

        dataArr = await db.find({ userName:userName }, { projection: { "_id": 0 } })
            .toArray();
    }
    catch (err) {
        console.log(err);
    } finally {
        client.close();
    }

    if (Object.keys(dataArr).length === 0) {
        // console.log("blank");
        return "notExists"
    }

    return dataArr[0].chatWindow;

}

async function getCollectionData(collName) {
    //console.log("Start of getCollectionData");
    console.log(typeof collName);
    if(collName === undefined){
        return null;
    }

    let MongoClient = require('mongodb').MongoClient;
    const configFile = require('./../../myUrl');
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    let dataArr;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    try {
        const db = client.db('testdb').collection(collName);
        //  console.log("Catch point 1");

        dataArr = await db.find({}, { projection: { "_id": 0 } })
            .toArray();
        //console.log(dataArr);
        // console.log("End of data catch point");
    }
    catch (err) {
        console.log(err);
    } finally {
        client.close();
    }

    //console.log("End of getCollectionData",dataArr);
    return dataArr;
}

async function getWholeChat(userName) {
    //let collName = await dumpData("testdb");
    var newArr = await getCollectionNames(userName);
    let totalDump = [];

    let allData = {
        chatWindows:newArr
    }

    console.log("TEST LOG HERE");
    console.log(allData.chatWindows);
    console.log(allData.chatWindows.length);

    for(let i=0;i<allData.chatWindows.length;i++){
        console.log(allData.chatWindows[i]);
        totalDump.push(allData.chatWindows[i]);
    }
    
    //start debugging from this point next time 
    for (let i = 0; i < allData.chatWindows.length; i++) {
        let collDump = await getCollectionData(allData.chatWindows[i]);
        totalDump.push(collDump);

        let tempChatWindowName; 
        if(collDump[0].from <= collDump[0].to){
            tempChatWindowName = collDump[0].from + collDump[0].to;
        }else{
            tempChatWindowName = collDump[0].to + collDump[0].from;
        }

        allData[tempChatWindowName] = collDump;
    }
     //console.log("Beautified Dump:",JSON.stringify(allData));
     
     return allData;
}

//getWholeChat("test2");
exports.createCollections = createCollections;
exports.insertData = insertData;
exports.updateProfile = updateProfile;
exports.chatWinowFinder = chatWinowFinder;
exports.chatWindowCollectionUpdate = chatWindowCollectionUpdate;
exports.verifyAuthToken = verifyAuthToken;
exports.socketIDUpdate = socketIDUpdate;
exports.findSocketID = findSocketID;
exports.getCollectionNames = getCollectionNames;
exports.getCollectionData = getCollectionData;
exports.getWholeChat = getWholeChat;