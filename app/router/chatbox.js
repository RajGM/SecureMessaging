const express = require('express');
const router = new express.Router();
var path = require('path');
var chatboxHelper = require('./../serverSideJs/chatboxHelper');

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const msgSent = require('../models/chatMsg');
const chatWindow = require('./../models/chatWindow');
const authToken = require('./../models/authToken');
const helperFun = require('./../serverSideJs/chatboxHelper');
const helperFun2 = require('./../serverSideJs/registerHelper');

//jwt web token
const jwt = require("jsonwebtoken");

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + './../views/' + 'chatbox.html'));
});

router.get('/data', verifyToken, async function (req, res) {

    let chatData = await chatboxHelper.getWholeChat(req.query.userName);
    res.json(chatData);
    //res.status(200).json(chatData);

});

router.post('/logout', async (req, res) => {
    console.log("Logging out");
    console.log("Body data", req.body);
    const aT = new authToken({
        userName: req.body.from,
        authToken: ""
    });
    let returnDoc;
    await authToken.findOneAndUpdate({ userName: req.body.from }, { authToken: "", authExpire: "" }, { upsert: true, useFindAndModify: false })
        .then(updatedDocument => {
            if (updatedDocument) {
                console.log("Updated" + updatedDocument);
            } else {
                console.log("Not updated" + updatedDocument);
            }
            returnDoc = updatedDocument;
            return updatedDocument;
        })
        .catch(err => console.log(err));

    console.log("Logout catch Point 2");
    res.status(200).json(returnDoc);
});

router.post('/', async (req, res) => {
    console.log("Posting Message");
    const msgValues = { from: "", to: "", message: "" };
    console.log(req.body);
    var timeStamp = new Date();

    if (req.body.from != "" && req.body.to != "" && req.body.message != "") {
        msgValues.from = req.body.from;
        msgValues.to = req.body.to;
        msgValues.message = req.body.message;
        msgValues.timeStamp = timeStamp;
    }
    console.log("Values in server object");
    console.log(msgValues);

    const newMessage = new msgSent({
        from: req.body.from,
        to: req.body.to,
        message: req.body.message,
        timeStamp: timeStamp
    });

    let fromProfile = await helperFun2.findProfile(newMessage.from);
    let toProfile = await helperFun2.findProfile(newMessage.to);
    if (toProfile == "exists" && fromProfile == "exists") {
        var usr1;
        var usr2;
        var usr1and2;
        if (req.body.to > req.body.from) {
            usr1 = req.body.from;
            usr2 = req.body.to;
        } else {
            usr1 = req.body.to;
            usr2 = req.body.from;
        }
        usr1and2 = usr1 + usr2;

        let chatboxState = await helperFun.chatWinowFinder(usr1and2);

        if (chatboxState == "exists") {
            helperFun.socketIDUpdate(newMessage.from, req.body.socketID);
            helperFun.insertData(usr1and2, newMessage);
            res.status(200).json({ pro: "Chatwindow exists" });
        } else {
            let chatW = new chatWindow({
                user1: usr1,
                user2: usr2,
                usr12: usr1and2
            });
            let profileUpdateStateFrom = await helperFun.updateProfile(newMessage.from, usr1and2);
            let profileUpdateStateTo = await helperFun.updateProfile(newMessage.to, usr1and2);
            let collectionCreationState = await helperFun.createCollections(usr1and2);
            let chatWindowCollUpdateState = await helperFun.chatWindowCollectionUpdate(chatW);
            let dataInsertState = await helperFun.insertData(usr1and2, newMessage);
            res.status(200).json({ pro: "Chatwindow does not exists created new collection" });
        }

    } else {
        res.status(200).json({ pro: "Reciever profile does not exists" });
    }

});

async function verifyToken(req, res, next) {
    const bearerHeader = req.query.authToken;
    let authorized = false;
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        // console.log("req.token = Bearer token");
        jwt.verify(bearerToken, 'secretkey', (err, authData) => {
            if (err) {
                console.log("Forbidden error" + err);
                res.status(403).json(err);
            } else {
                // console.log("Auth Data:", authData);
                if(authData.responseObj.userName == req.query.userName){
                    authorized = true;
                }else{
                    res.status(403);
                }
                // console.log("Everything is good UPDATE SOCKET ID NOW");
            }
        });

        if (authorized == true) {
            let socketIDstatus = await chatboxHelper.socketIDUpdate(req.query.userName, req.query.socketID);
            // console.log("SOCKET ID STATUS:" + socketIDstatus);
        }

        next();
    } else {
        res.status(404).json("unAuthorized");
    }

}

module.exports = router;