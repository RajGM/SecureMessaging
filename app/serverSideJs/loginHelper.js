const logProfile = require('../models/profile');
const authToken = require('../models/authToken');
const configFile = require('./../../myUrl');

async function loginProfile(userName,password) {
    let MongoClient = require('mongodb').MongoClient;
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    let dataArr;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    console.log("Values in loginHelper function");
    console.log("userName:"+userName+" password:"+password);
    try {
        const db = client.db('testdb').collection("userprofiles");
        dataArr = await db.find({ userName }, { projection: { "_id": 0 ,"__v":0} })
            .toArray();        
    }
    catch (err) {
        console.log(err);
    } finally {
        client.close();
    }

    console.log(typeof dataArr);
    console.log("dataArr",dataArr);
    if (Object.keys(dataArr).length === 0) {
        console.log("blank");
        return "notExists"
    }else{
        if(password==dataArr[0].password){
            return "correct";
        }else{
            return "incorrect";
        }
    }

}

async function callME(){
    let userName = "test";
    let password = "123";
    let logA = await loginProfile(userName,password);
    console.log("type of logA:"+ typeof logA);
    console.log(logA);
}

//callME();

exports.loginProfile = loginProfile;