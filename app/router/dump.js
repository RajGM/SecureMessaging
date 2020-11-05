const express = require('express');
const router = new express.Router();
var path = require('path');
const regProfile = require('./../models/profile');

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + './../views/' + 'dump.html'));
});

router.get('/data', async function (req, res) {
    let totalDump = [];
    let collName = await dumpData("testdb");
    totalDump.push(collName);
    //console.log(collName);
    for(let i=0;i<collName.length;i++){
        let collDump = await getCollectionData(collName[i]);
        totalDump.push(collDump);
    }
    res.status(200).json(totalDump);
});

async function dumpData(DBname) {
    var MongoClient = require('mongodb').MongoClient;
    const configFile = require('./../../myUrl');
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    let collectionNames;

    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    try {
        let dbo = client.db(DBname);

        collectionNames = await dbo.listCollections({},{"nameOnly":1}).toArray();
    }
    catch(err){
        console.log(err)
    }
    finally{
        client.close();
    }
    let onlyColNae = [];
    for(let i=0;i<collectionNames.length;i++){
        onlyColNae.push(collectionNames[i].name);
    }
    //console.log(onlyColNae);
    return onlyColNae;
};

async function getCollectionNames(userName) {
    //console.log("Start of getCollectionNames");
    const profile = await regProfile.findOne({ userName });
     console.log('full profile promise: ', profile);
    //handdle the case of profile not found here
    // console.log("End of getCollectionNames");
    return profile.chatWindow;
}

async function getCollectionData(collName) {
    //console.log("Start of getCollectionData");
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

    // console.log("End of getCollectionData");
    return dataArr;
}

module.exports = router;