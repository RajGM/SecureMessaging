const regProfile = require('../models/profile');
const authToken = require('./../models/authToken');
const configFile = require('./../../myUrl');

async function findProfile(userName) {
    //console.log("Start of getCollectionData");
    let MongoClient = require('mongodb').MongoClient;
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    let dataArr;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    try {
        const db = client.db('testdb').collection("userprofiles");
        //  console.log("Catch point 1");

        dataArr = await db.find({ userName }, { projection: { "_id": 0 } })
            .toArray();
        //console.log(dataArr);
        // console.log("End of data catch point");
    }
    catch (err) {
        console.log(err);
    } finally {
        client.close();
    }

    //Object.keys(obj).length === 0;
    console.log(typeof dataArr);
    if (Object.keys(dataArr).length === 0) {
        console.log("blank");
        return "notExists"
    }
    return dataArr;

}

async function createProfile(userName, password) {
    let profileState = await findProfile(userName);
    if (profileState.toString() != "notExists") {
        return "profileExists";
    } else {

        let MongoClient = require('mongodb').MongoClient;
        const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
        let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
            .catch(err => console.log(err));

        console.log("Before catch");
        try {
            const db = client.db('testdb').collection("userprofiles");
              console.log("Catch point 1");

            const newProfile = new regProfile({
                userName:userName,
                password:password
            });

            let dbInsert = await db.insertOne(newProfile)
                .then(pro=>{
                    console.log(pro);
                })
                .catch(err=>{
                    console.log(err);
                })

            console.log("dbInsert state:",dbInsert);
          
           const dbaT = client.db('testdb').collection("authtokens");
            const authTokenDB = new authToken({
                userName:userName,
                authToken:"",
                authExpire:""
            });
            
            let authInsert = await dbaT.insertOne(authTokenDB)
                    .then(aT=>{
                        console.log("Auth Token created",aT);
                    })
                    .catch(err=>{
                        console.log("Auth Token creation problem",err)
                    });

            console.log("AuthToken state",authInsert);
           
        }
        catch (err) {
            console.log(err);
        } finally {
            client.close();
        }

    }

    return "profileCreated";

}

async function callME() {
    let userName = "test5000";
    let password = "123";
    console.log("callME started");
    let ok = await findProfile(userName);
    console.log("ok", ok);
    console.log("ok type", typeof of);
    if (ok.toString() == "notExists") {
        console.log("working");
        let proCreation = await createProfile(userName,password);
        console.log(proCreation);
    }
    console.log("callME end");
}

callME();