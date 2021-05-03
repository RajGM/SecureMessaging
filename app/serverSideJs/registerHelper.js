const regProfile = require('../models/profile');
const authToken = require('./../models/authToken');
const socketToken = require('./../models/socketToken');
const configFile = require('./../../myUrl');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

// nodeMailer test
const nodemailer = require("nodemailer");
//

async function findProfile(userName, email) {
    console.log("UserName:" + userName);
    console.log("Email:" + email);
    let MongoClient = require('mongodb').MongoClient;
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    let dataArr;
    let dataArr2;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    try {
        const db = client.db('testdb').collection("userprofiles");

        dataArr = await db.find({ userName }, { projection: { "_id": 0 } })
            .toArray();

        dataArr2 = await db.find({ email }, { projection: { "_id": 0 } })
            .toArray();

    }
    catch (err) {
        console.log(err);
    } finally {
        client.close();
    }

    if (Object.keys(dataArr).length === 0 && Object.keys(dataArr2).length === 0) {
        return "notExists"
    }
    return "exists";

}

async function createProfile(userName, password, email) {

    let MongoClient = require('mongodb').MongoClient;
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    try {
        const db = client.db('testdb').collection("userprofiles");

        const newProfile = new regProfile({
            userName: userName,
            password: password,
            email: email
        });

        let hashedPassword = await generateHashedPassword(password);
        newProfile.password = hashedPassword;

        let dbInsert = await db.insertOne(newProfile)
            .then(pro => {
                console.log("proCreated", pro);
            })
            .catch(err => {
                console.log("Profile creation problem", err);
            });

        let newSocketToken = await new socketToken({
            userName: userName,
            socketID: ""
        });

        const dbsT = client.db("testdb").collection("sockettoken");
        let stInsert = await dbsT.insertOne(newSocketToken)
            .then(stTok => {
                console.log("SocketToken created:" + stTok);
            })
            .catch(err => {
                console.log("SocketToken creation error:" + err)
            });

        //confirmation email sending
        await generateEmailConfirmationToken(email);
        //

    }
    catch (err) {
        console.log(err);
    } finally {
        client.close();
    }

    return "profileCreated";

}

async function generateHashedPassword(password) {
    let saltRounds = 10;
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hashedPassword = await bcrypt.hashSync(password, salt);

    console.log("HASHED PASSWORD:" + hashedPassword);

    return hashedPassword;
}

async function generateEmailConfirmationToken(email) {

    let confirmationToken = await jwt.sign({ email }, 'secretkey', { expiresIn: '1d' }, (err, token) => {
            sendConfirmationEmail(email,token);
        });

    return confirmationToken;
}

async function sendConfirmationEmail(email, emailConfirmationToken) {

    "use strict "

    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "testat447@gmail.com",
            pass: "testatnodemailer447",
        },
    });

    try {

        const url = `http://localhost:8000/confirmation/${emailConfirmationToken}`;

        await transporter.sendMail({
            from: '"Fred Foo 👻"<testat447@gmail.com>',
            to: email,
            subject: 'SECOND TEST Confirm Email',
            text: "SECOND TEST EMAIL", // plain text body
            html: `SECOND TEST CONFIRM EMAIL: <a href="${email}">${url}</a>`,
        });

    } catch (e) {
        console.log(e);
    }

}

exports.findProfile = findProfile;
exports.createProfile = createProfile;