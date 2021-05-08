const confidential = require('./../../confidential');
const configFile = require('./../../myUrl');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

async function loginProfile(userName, password) {

    let logA = await verifyUNamePass(userName, password);
    if (logA == "correct") {
        let authTok = await updateAuthToken(userName);
        console.log("authTok return State:", authTok);
        console.log("updated");
        return ["correct",authTok];
    } else {
        return "incorrect";
    }

}

async function verifyUNamePass(userName, password) {
    let MongoClient = require('mongodb').MongoClient;
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    let dataArr;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

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

    if (Object.keys(dataArr).length === 0) {
        return "notExists"
    } else {
        if (bcrypt.compareSync(password, dataArr[0].password)) {
            console.log("Correct password");
            return "correct";
        } else {
            console.log("Incorrect password");
            return "incorrect";
        }
    }

}

async function updateAuthToken(userName) {
    let MongoClient = require('mongodb').MongoClient;
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    let dataArr;
    let token;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    try {

        token = await generateAuthToken(userName);

        const db = await client.db('testdb').collection('authtokens');
        dataArr = await db.updateOne({ userName: userName }, { $set: { authToken: token } }, { upsert: true, useFindAndModify: false });

    } catch (err) {
        console.log("authToken updation error:" + err);
    } finally {
        client.close();
    }

    return token;
}

async function generateAuthToken(userName) {
    return new Promise(async (resolve, reject) => {
        let confirmationToken = await jwt.sign({ userName }, confidential.secretkey , { expiresIn: '1d' }, (err, token) => {
            resolve(token)
        });
    })

}

exports.loginProfile = loginProfile;