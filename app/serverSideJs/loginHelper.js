//import required modules
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

//calls relevant funtion to login
async function loginProfile(userName, password,mongoClient) {
  
    let logA = await verifyUNamePass(userName, password,mongoClient);
    if (logA == "correct") {
        let authTok = await updateAuthToken(userName,mongoClient);
        return ["correct",authTok];
    } else {
        return "incorrect";
    }

}

//call relevant funtions to verify userName and password
async function verifyUNamePass(userName, password,mongoClient) {
    let dataArr;
    
    try {
        const db = mongoClient.db(process.env.mongoDBName).collection("userprofiles");
        dataArr = await db.find({ userName }, { projection: { "_id": 0, "__v": 0 } })
            .toArray();
    }
    catch (err) {
        console.log(err);
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
async function updateAuthToken(userName,mongoClient) {
    let dataArr;
    let token;
  
    try {

        token = await generateAuthToken(userName);

        const db = await mongoClient.db(process.env.mongoDBName).collection('authtokens');
        dataArr = await db.updateOne({ userName: userName }, { $set: { authToken: token } }, { upsert: true, useFindAndModify: false });

    } catch (err) {
        console.log("authToken updation error:" + err);
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