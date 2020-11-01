const chatMessage = require('./../models/chatMsg');

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
        let returnData = await db.updateOne({userName: userName},
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

async function callME() {
    //let collectionName = "testingColl2";
    //let userName = "test404";
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
}

//callME();

exports.createCollections = createCollections;
exports.insertData = insertData;
exports.updateProfile = updateProfile;