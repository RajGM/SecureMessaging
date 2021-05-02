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

    // console.log("DATA ARR");
    // console.log(dataArr);
    // console.log("DATA ARR 2");
    // console.log(dataArr2);
    // console.log("DATA ARR SIZE");
    // console.log(Object.keys(dataArr).length);
    // console.log(Object.keys(dataArr2).length);

    if (Object.keys(dataArr).length === 0 && Object.keys(dataArr2).length === 0) {
        console.log("blank");
        return "notExists"
    }
    return "exists";

}

async function createProfile(userName, password, email) {

    let MongoClient = require('mongodb').MongoClient;
    const url = configFile.mongoURL + configFile.userName + ":" + configFile.password + configFile.restUrl;
    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.log(err));

    console.log("Before catch");
    try {
        const db = client.db('testdb').collection("userprofiles");
        console.log("Catch point 1");

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

        console.log("dbInsert state:", dbInsert);

        const dbaT = client.db('testdb').collection("authtokens");
        const authTokenDB = new authToken({
            userName: userName,
            authToken: "",
            authExpire: ""
        });

        let authInsert = await dbaT.insertOne(authTokenDB)
            .then(aT => {
                console.log("Auth Token created", aT);
            })
            .catch(err => {
                console.log("Auth Token creation problem", err)
            });

        console.log("AuthToken state", authInsert);


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

async function sendConfirmationEmail(email, emailConfirmationToken) {

    "use strict "

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    //   let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "testat447@gmail.com",
            pass: "testatnodemailer447",
        },
    });

    // send mail with defined transport object
    // let info = await transporter.sendMail({
    //     from: '"Fred Foo 👻"<testat447@gmail.com>', // sender address
    //     to: `mifed93846@httptuan.com, ${email}`, // list of receivers
    //     subject: "NodeMailer Test ✔", // Subject line
    //     text: "Test Email", // plain text body
    //     html: `Please click this email to confirm your email:${testToken}</a>`, // html body
    // });

    // console.log("Message sent: %s", info.messageId);
    // console.log(info);
    // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...


    try {

        const url = `http://localhost:8000/confirmation/${emailConfirmationToken}`;

        await transporter.sendMail({
            from: '"Fred Foo 👻"<testat447@gmail.com>',
            to: email,
            subject: 'SECOND TEST Confirm Email',
            text: "SECOND TEST EMAIL", // plain text body
            html: `SECOND TEST CONFIRM EMAIL: <a href="${email}">${url}</a>`,
        });

        console.log("EMAIL TOKEN BY JWT", emailConfirmationToken);


    } catch (e) {
        console.log(e);
    }




}

async function generateEmailConfirmationToken(email) {

    try {
        let confirmationToken;
        await jwt.sign({ email }, 'secretkey', { expiresIn: '300000s' }, (err, token) => {
            console.log("EMAIL TOKEN From inside GENERATE EMAIL CONFIRMATION TOKEN:" + token);
            confirmationToken = token;
        });
        return confirmationToken;
    } catch (e) {
        console.log(e);
        return false;
    }

}

async function testFun(email){
    let confirmationToken = await generateEmailConfirmationToken(email);
    console.log("Confirmation Token:", confirmationToken);
    let emailStatus = await sendConfirmationEmail(email, confirmationToken);
    console.log("EMAIL STATUS:", emailStatus);
}

//testFun("foe05479@eoopy.com");



exports.findProfile = findProfile;
exports.createProfile = createProfile;