//import required modules
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

//calls relevant funtion to login
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

//call relevant funtions to verify userName and password
async function verifyUNamePass(userName, password) {
    let MongoClient = require('mongodb').MongoClient;
    const url = process.env.mongoURL + process.env.mongoUserName + ":" + process.env.mongoPassword + process.env.mongoRestUrl;
    let dataArr;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    try {
        const db = client.db(process.env.mongoDBName).collection("userprofiles");
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

//update authentication token
async function updateAuthToken(userName) {
    let MongoClient = require('mongodb').MongoClient;
    const url = process.env.mongoURL + process.env.mongoUserName + ":" + process.env.mongoPassword + process.env.mongoRestUrl;
    let dataArr;
    let token;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    try {

        token = await generateAuthToken(userName);

        const db = await client.db(process.env.mongoDBName).collection('authtokens');
        dataArr = await db.updateOne({ userName: userName }, { $set: { authToken: token } }, { upsert: true, useFindAndModify: false });

    } catch (err) {
        console.log("authToken updation error:" + err);
    } finally {
        client.close();
    }

    return token;
}

//generate authentication token using jwt
async function generateAuthToken(userName) {
    return new Promise(async (resolve, reject) => {
        let confirmationToken = await jwt.sign({ userName }, process.env.authSecretkey , { expiresIn: '1d' }, (err, token) => {
            resolve(token)
        });
    })

}

//export required functions
exports.loginProfile = loginProfile;