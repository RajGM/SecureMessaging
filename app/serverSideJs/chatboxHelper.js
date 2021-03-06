
//create Collection in MongoDB using the provided Name
async function createCollections(name) {
    var MongoClient = require('mongodb').MongoClient;
    
    const url = process.env.mongoURL + process.env.mongoUserName + ":" + process.env.mongoPassword + process.env.mongoRestUrl;
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    let creationState;

    try {
        const db = client.db(process.env.mongoDBName);
        let returnData = await db.createCollection(name)
            .catch(err => console.log(err));
        if (returnData) {
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

//used to insert data in MongoDB
async function insertData(name, data) {
    var MongoClient = require('mongodb').MongoClient;
    
    const url = process.env.mongoURL + process.env.mongoUserName + ":" + process.env.mongoPassword + process.env.mongoRestUrl;
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

//insert chatWindow between users talking first time in user's profile
async function updateProfile(userName, chatboxName) {
    var MongoClient = require('mongodb').MongoClient;
    
    const url = process.env.mongoURL + process.env.mongoUserName + ":" + process.env.mongoPassword + process.env.mongoRestUrl;
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

//insert chatWindow in the list of all chatWindow 
async function chatWindowCollectionUpdate(data) {
    var MongoClient = require('mongodb').MongoClient;
    
    const url = process.env.mongoURL + process.env.mongoUserName + ":" + process.env.mongoPassword + process.env.mongoRestUrl;
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

//update Socket for user
async function socketIDUpdate(userName, socketID) {

    var MongoClient = require('mongodb').MongoClient;
    
    const url = process.env.mongoURL + process.env.mongoUserName + ":" + process.env.mongoPassword + process.env.mongoRestUrl;
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));
    let updationState;

    try {
        const db = client.db("testdb").collection("sockettoken");
        
        let returnData = await db.updateOne({ userName: userName }, { $set: { socketID: socketID } }, { upsert: true, useFindAndModify: false });
        if (returnData) {
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

//check if chatWindow exists between user or not
async function chatWinowFinder(windowName) {
    let MongoClient = require('mongodb').MongoClient;
    
    const url = process.env.mongoURL + process.env.mongoUserName + ":" + process.env.mongoPassword + process.env.mongoRestUrl;
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

    if (Object.keys(dataArr).length === 0) {
        console.log("blank");
        return "notExists"
    } else {
        console.log("Something found");
        console.log(dataArr[0].usr12);
        return "exists";
    }
}

//find socketID of user
async function findSocketID(userName,mongoClient) {
    
    try {
        const db = mongoClient.db('testdb').collection("sockettoken");
        dataArr = await db.find({ userName }, { projection: { "_id": 0 } })
            .toArray();
    }
    catch (err) {
        console.log(err);
    }

    if (Object.keys(dataArr).length === 0) {
        console.log("Test@123 socket not exists");
        return "notExists";
    } else {
        console.log("Test@123 socketID:"+dataArr[0].socketID);
        if(dataArr[0].socketID.length == 0){
            return false;
        }else{
            return dataArr[0].socketID;
        }
        
    }

}

//verify authToken of user
async function verifyAuthToken(userName, authToken, mongoClient) {
   
    try {
        const db = mongoClient.db('testdb').collection("authtokens");
        dataArr = await db.find({ userName }, { projection: { "_id": 0 } })
            .toArray();
    }
    catch (err) {
        console.log(err);
    } 

    if (Object.keys(dataArr).length === 0) {
        console.log("blank");
        return "notExists"
    } else {
        if (authToken == dataArr[0].authToken) {
            return true;
        } else {
            return false;
        }
    }

}

//get whole profile of particular user 
async function getCollectionNames(userName) {

    
    let MongoClient = require('mongodb').MongoClient;
    const url = process.env.mongoURL + process.env.mongoUserName + ":" + process.env.mongoPassword + process.env.mongoRestUrl;
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
        return "notExists"
    }

    return dataArr[0].chatWindow;

}

//get whole data of particular collection in MongoDB
async function getCollectionData(collName) {
    
    //console.log(typeof collName);
    if(collName === undefined){
        return null;
    }

    let MongoClient = require('mongodb').MongoClient;
    
    const url = process.env.mongoURL + process.env.mongoUserName + ":" + process.env.mongoPassword + process.env.mongoRestUrl;
    let dataArr;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    try {
        const db = client.db('testdb').collection(collName);
        
        dataArr = await db.find({}, { projection: { "_id": 0 } })
            .toArray();
        
    }
    catch (err) {
        console.log(err);
    } finally {
        client.close();
    }

    return dataArr;
}

//get all chat data of particular user
async function getWholeChat(userName) {
    var newArr = await getCollectionNames(userName);
    let totalDump = [];

    let allData = {
        chatWindows:newArr
    }

   
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
    
     return allData;
}

//check if user profile exists or not 
async function findProfile(userName) {
    let MongoClient = require('mongodb').MongoClient;
    const url = process.env.mongoURL + process.env.mongoUserName + ":" + process.env.mongoPassword + process.env.mongoRestUrl;
    let dataArr;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));
    try {
        const db = client.db(process.env.mongoDBName).collection("userprofiles");

        dataArr = await db.find({ userName }, { projection: { "_id": 0 } })
            .toArray();

    }
    catch (err) {
        console.log(err);
    } finally {
        client.close();
    }

    if (Object.keys(dataArr).length === 0 ) {
        return "notExists"
    }
    return "exists";
}

//export all of the functions
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
exports.findProfile = findProfile;