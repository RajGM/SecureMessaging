const logProfile = require('../models/profile');
const authToken = require('../models/authToken');
const configFile = require('./../../myUrl');

async function loginProfile(userName, password) {

    //verify then update
    let logA = await verifyUNamePass(userName, password);
    if (logA == "correct") {
        let authTok = await updateAuthToken(userName);
        console.log("authTok return State:", authTok);
        console.log("updated");
        //let socketIDTok = await updateSocketToken(userName,"socketID");
        //console.log("socketID return State:",socketIDTok);
        return "correct";
    } else {
        console.log("incorrect");
        return "incorrect";
    }

}

async function verifyUNamePass(userName, password) {
    let MongoClient = require('mongodb').MongoClient;
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    let dataArr;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    console.log("Values in loginHelper function");
    console.log("userName:" + userName + " password:" + password);
    try {
        const db = client.db('testdb').collection("userprofiles");
        dataArr = await db.find({ userName }, { projection: { "_id": 0, "__v": 0 } })
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
        if (password == dataArr[0].password) {
            return "correct";
        } else {
            return "incorrect";
        }
    }

}

async function updateAuthToken(userName) {
    let MongoClient = require('mongodb').MongoClient;
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    let dataArr;
    let doc;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    try {
        client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
            .catch(err => console.log(err));

        const db = client.db('testdb').collection('authtokens');
        dataArr = await db.updateOne({ userName: userName }, { $set: { authToken: "ABCDEFG", authExpire: "Soon2Expire" } }, { upsert: true, useFindAndModify: false });
        /*
        .then(updatedDoc => {
            if (updatedDoc) {
                doc = updatedDoc;
                console.log("updatedDoc Fail:" + updatedDoc);
            } else {
                console.log("updatedDoc:" + updatedDoc);
            }
        })
        .catch(err => {
            console.log(err);
        })
        */
        console.log("authTOken update state:" + dataArr);
    } catch (err) {
        console.log("authToken updation error:" + err);
    } finally {
        client.close();
    }

    return "ABCDEFGH";
}

async function callME() {
    let userName = "test";
    let password = "123";
    let authTok = "";
    let logA = await verifyUNamePass(userName, password);
    console.log("type of logA:" + typeof logA);
    console.log(logA);
    if (logA == "correct") {
        authTok = await updateAuthToken(userName);
        console.log("authTok return State:", authTok);
        console.log("updated");
    } else {
        console.log("incorrect");
    }
}

//callME();

exports.loginProfile = loginProfile;