const express = require('express');
const router = new express.Router();
var path = require('path');
const regProfile = require('./../models/profile');
const chatW = require('./../models/chatWindow');
const { MongoClient } = require('mongodb');
const { resolve } = require('path');
const { rejects } = require('assert');

var collectionArr;

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + './../views/' + 'dump.html'));
});

router.get('/data', async function (req, res) {

    //const profile = await getCollectionNames('test');
    //handle the null cases here
    const profileChat = await getCollectionData('testtest2');
    console.log("ConsoleLog from res:" + profileChat);
    res.status(200).json(profile);
});

function dumpData(DBname) {
    var MongoClient = require('mongodb').MongoClient;
    const configFile = require('./../../myUrl');

    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DBname);
        dbo.listCollections().toArray(function (err, collections) {
            console.log(collections);
        });
        db.close();
    });
};

async function getCollectionNames(userName) {
    console.log("Start of getCollectionNames");
    const profile = await regProfile.findOne({ userName: userName });
    console.log('full profile promise: ', profile);
    //handdle the case of profile not found here
    console.log("End of getCollectionNames");
    return profile.chatWindow;
}

async function getCollectionData(collName) {
    console.log("Start of getCollectionData");
    let MongoClient = require('mongodb').MongoClient;
    const configFile = require('./../../myUrl');
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;

    MongoClient.connect(url, async (err, client) => {

        if (err) throw err;
        const db = client.db('testdb');
        console.log("Catch point 1");
        let dbo = db.collection(collName);
        console.log("Catch point 2");
        let pro = new Promise((resolve, rejects) = {

        })
        let fin = await dbo.find({}, { projection: { "_id": 0 } })
            .toArray(await function (err, data) {
                if (err) throw err;
                console.log(data);
            })
        console.log("fin", fin);

        console.log("End of getCollectionData");
    })

    return;
}

async function callME() {
    let ok = await getCollectionData("testtest2");
    //console.log("Typeof OK:", typeof ok);
    //console.log("OK:", ok);
}

callME();

async function getWholeChat(userName) {
    console.log("Before calling getCollectionNames");
    var newArr = await getCollectionNames(userName);
    collectionArr = newArr;
    console.log("Testing local return:" + newArr);
    console.log("After calling getCollectionNames");
}

module.exports = router;