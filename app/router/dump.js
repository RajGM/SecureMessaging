const express = require('express');
const router = new express.Router();
var path = require('path');
const regProfile = require('./../models/profile');
const chatW = require('./../models/chatWindow');
const { MongoClient } = require('mongodb');

var collectionArr;

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + './../views/' + 'dump.html'));
});

router.get('/data',  async function (req, res) {
    
    const profile = await getCollectionNames('test');
    //handle the null cases here
    const profileChat = await getCollectionData('testtest2');
    console.log("ConsoleLog from res:"+profileChat);
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
    const profile = await regProfile.findOne({ userName:userName });
    console.log('full profile promise: ' ,profile);
    //handdle the case of profile not found here
    console.log("End of getCollectionNames");
    return profile.chatWindow;
}

async function getCollectionData(collName) {
    console.log("Start of getCollectionData");
    let MongoClient = require('mongodb').MongoClient;
    const configFile = require('./../../myUrl');
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    
    console.log("Before calling MonogClient connect");
    let returnCollData = await MongoClient.connect(url,function(err,db){
        console.log("Inside MongoClient 1");
        if (err) throw err;

        let dbo =  db.db("testdb");
        let chatList =  dbo.collection(collName);
        console.log("Inside MongoClient 2");
        let test123 =  chatList.find( {}, {projection:{"_id":0}})
        .toArray( async (err,result)=>{
            console.log("Inside MongoClient 3");
            if (err) throw err;
            console.log("Inside MongoClient 4");
            await console.log(result);
            await console.log("test123:"+test123);
        })

        
        //.toArray();
        console.log("chatList");
        
        db.close();
    });
    
    
    console.log("End of getCollectionData");
    return returnCollData;
};
getCollectionData("testtest2");

async function getWholeChat(userName) {
    console.log("Before calling getCollectionNames");
    var newArr = await getCollectionNames(userName);
    collectionArr = newArr;
    console.log("Testing local return:"+newArr);
    console.log("After calling getCollectionNames");
}

module.exports = router;