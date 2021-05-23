//import required modules and required helper funtions
const regProfile = require('../models/profile');
const socketToken = require('./../models/socketToken');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

//calls relevant funtions to check if userName or email already exists 
async function findProfile(userName, email) {
    let MongoClient = require('mongodb').MongoClient;
    const url = process.env.mongoURL + process.env.mongoUserName + ":" + process.env.mongoPassword + process.env.mongoRestUrl;
    let dataArr;
    let dataArr2;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));
    try {
        const db = client.db(process.env.mongoDBName).collection("userprofiles");

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

//calls relevant functions to insert new user data into database 
async function createProfile(userName, password, email) {

    let MongoClient = require('mongodb').MongoClient;
    const url = process.env.mongoURL + process.env.mongoUserName + ":" + process.env.mongoPassword + process.env.mongoRestUrl;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    try {
        const db = client.db(process.env.mongoDBName).collection("userprofiles");

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

        const dbsT = client.db(process.env.mongoDBName).collection("sockettoken");
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

//generate hashed version of password
async function generateHashedPassword(password) {
    let saltRounds = 10;
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hashedPassword = await bcrypt.hashSync(password, salt);

    return hashedPassword;
}

//calls relevant function to generate jwt token and calls funtion to send confirmation email
async function generateEmailConfirmationToken(email) {

    let confirmationToken = await jwt.sign({ email }, process.env.emailSecretKey , { expiresIn: '1d' }, (err, token) => {
            sendConfirmationEmail(email,token);
        });

    return confirmationToken;
}

//sends confirmation email to user's email address
async function sendConfirmationEmail(email, emailConfirmationToken) {

    "use strict "

    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.emailID,
            pass: process.env.emailPassword,
        },
    });

    try {

        const url = `http://localhost:8000/confirmation/${emailConfirmationToken}`;

        await transporter.sendMail({
            from: '"Fred Foo 👻"<testat447@gmail.com>',
            to: email,
            subject: 'SECOND TEST Confirm Email',
            text: "SECOND TEST EMAIL", 
            html: `SECOND TEST CONFIRM EMAIL: <a href="${email}">${url}</a>`,
        });

    } catch (e) {
        console.log(e);
    }

}

//exports respective modules
exports.findProfile = findProfile;
exports.createProfile = createProfile;