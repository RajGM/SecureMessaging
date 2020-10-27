const express = require('express');
const router = new express.Router();
var path = require('path');
const regProfile = require('./../models/profile');
var wholeCollData = [];
var collectionArr;

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + './../views/' + 'dump.html'));
});

router.get('/data',  async function (req, res) {
    //wholeCollData = [];
    //dumpData("testdb");
    //getWholeChat("test");
    //console.log("collectionArr:"+collectionArr);
    /*const dost = async () => {
        let var2 = await getCollectionNames("test");
        return var2
        // run it
    }
    //thanks/


    // man your code is terrible

    // why did you make so many functions?
    //previously i was just using one 
    //but i was not able to get job done 
    //so i tried dealying by calling multiple async and await
    //to spot the problem
    const callMe = async () =>{
        var x = await dost();
        console.log("X success:"+x);

    }
    //yes it is working 
    // also don't use var, it create conflict, global scope
    / use let and constde of
    //ok i 
    you can also use async route handling functions
    // there is no problem in that instead of making functions 
    inside functions
    it's too complex
    and if you need to define a new functino for something
    then do it outsi
    // ok by buddy
    // best of luck!
    //thanks mate
    // can i add you on linkedIN?
    sure
    callMe();*/

    const profile = await getCollectionNames('test')
    // it'd work file
    console.log('success: ', profile);
    
    res.status(200).json("collectionArr");
    //here 
    // now run it?
    //ok , run it
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
    const profile = await regProfile.findOne({ userName });
    console.log('profile: ' ,profile)
    // keep postman on left side of window fixed
    // and move vscode and terminal on right hav

    // what do you want to do with this profile?
    //return it ?
    //yes either return it or save it to collectionArr
    //but the problem is even after using await res.json gets 
    //before finnishing this function
    return profile
    // run it
    // whree are you calling res.json for this?
}

function _getCollectionNames(userName) {
   // new Promise((resolve, reject) => {

    //var localchatWindowArr;
    async function dos(){
        var testPromise = await regProfile.findOne({ userName: userName });
        console.log("testPromises:"+testPromise);
        return testPromise;
    }

    var t = dos();
    console.log('t: ', t);
    t.then(data => {i
        console.log('data: ', data)
    }).catch(err=>{
        console.log(err);
    })
    /*
        .then(profileEmail => {
            if (profileEmail) {
                localchatWindowArr = profileEmail.chatWindow; 
                console.log(profileEmail.chatWindow);
                //collectionArr = profileEmail.chatWindow;
                //return profileEmail.chatWindow;
                //resolve(collectionArr = profileEmail.chatWindow);
                //console.log(collectionArr);              
            }
            else {
                // where is this res object?
                //I was just trying to test the else case so put res here but it is not working as I have no access to router.get('/data', function (req, res) { res got it

                res.status(200).json({ response: "Fail",message:"Profile does not exists" });
                //Fail Case
            }
        })
        .catch(err => console.log(err));
    */
   //console.log(testPromise.chatWindow);
   //localchatWindowArr = testPromise.chatWindow;
    //console.log("End of getCollectionNames:" + collectionArr);tho
    //console.log("TestPromise:"+testPromise);
    //collectionArr = testPromise.chatWindow;
    //return localchatWindowArr;
    //});
}

getCollectionNames('test')

function getCollectionData(collName) {
    console.log("Start of getCollectionData");
    var MongoClient = require('mongodb').MongoClient;
    const configFile = require('./../../myUrl');
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;

    MongoClient.connect(
        url,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (err, client) => {
            if (err) throw err;

            client
                .db("testdb")
                .collection(collName)
                .find({})
                .project({ timeStamp: 0, _id: 0 })
                .toArray((err, data) => {
                    if (err) throw err;

                    //console.log(data);
                    wholeCollData.push(data);
                    //console.log(wholeCollData);

                    client.close();
                });
        }
    );

    console.log("End of getCollectionData");
    console.log(wholeCollData);
};

async function getWholeChat(userName) {
    console.log("Before calling getCollectionNames");
    var newArr = await getCollectionNames(userName);
    collectionArr = newArr;
    console.log("Testing local return:"+newArr);
    console.log("After calling getCollectionNames");
}

module.exports = router;