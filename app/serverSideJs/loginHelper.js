const configFile = require('./../../myUrl');
const bcrypt = require('bcrypt');


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
        // console.log("incorrect");
        return "incorrect";
    }

}

async function verifyUNamePass(userName, password) {
    let MongoClient = require('mongodb').MongoClient;
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    let dataArr;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    // console.log("Values in loginHelper function");
    // console.log("userName:" + userName + " password:" + password);
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

    // console.log(typeof dataArr);
    // console.log("dataArr", dataArr);
    if (Object.keys(dataArr).length === 0) {
        // console.log("blank");
        return "notExists"
    } else {
        let hashedPassword = await generateHashedPassword(password);
         // true
        //hashedPassword == dataArr[0].password
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
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    try {
        const db = client.db('testdb').collection('authtokens');
        dataArr = await db.updateOne({ userName: userName }, { $set: { authToken: "ABCDEFG", authExpire: "Soon2Expire" } }, { upsert: true, useFindAndModify: false });

        // console.log("authTOken update state:" + dataArr);
    } catch (err) {
        console.log("authToken updation error:" + err);
    } finally {
        client.close();
    }

    return "ABCDEFGH";
}

async function generateHashedPassword(password){
    let saltRounds = 10;
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hashedPassword = await bcrypt.hashSync(password, salt);

    console.log("HASHED PASSWORD:"+hashedPassword);

    return hashedPassword;
}




exports.loginProfile = loginProfile;