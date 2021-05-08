//importing modules
const express = require('express');
const router = new express.Router();
const jwt = require("jsonwebtoken");
var bodyParser = require('body-parser')

//getting path of public files
var path = require('path');

//getting models
const authToken = require('./../models/authToken');

//getting custom build funtions for this file
var chatboxHelper = require('./../serverSideJs/chatboxHelper');

// @type    GET
//@route    /chatbox
// @desc    for sending chatbox page
// @access  PUBLIC
router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + './../views/' + 'chatbox.html'));
});

// @type    GET
//@route    /chatbox/data
// @desc    for sending data of particular user
// @access  PRIVATE
router.get('/data', verifyToken, async function (req, res) {

    let chatData = await chatboxHelper.getWholeChat(req.query.userName);
    try{
        res.status(200).json(chatData);
    }catch(err){
        console.log("HEADER ERROR:"+err);
    }
    
});

// @type    POST
//@route    /chatbox/logout
// @desc    for logging out user 
// @access  PRIVATE
//fix this so that it only let user logout after verifying the token
router.post('/logout', async (req, res) => {
    const aT = new authToken({
        userName: req.body.from,
        authToken: req.body.authToken
    });
    console.log("LOGOUT DATA:",aT);
    let returnDoc;
    await authToken.findOneAndUpdate({ userName: req.body.from }, { authToken: ""}, { upsert: true, useFindAndModify: false })
        .then(updatedDocument => {
            if (updatedDocument) {
                //document updated
            } else {
                //document not updated
            }
            returnDoc = updatedDocument;
            return updatedDocument;
        })
        .catch(err => console.log(err));

    res.status(200).json("logout success");
});

//funtion to verify authToken
async function verifyToken(req, res, next) {

    let userData = {
        userName:req.query.userName,
        authToken:req.query.authToken,
        socketID:req.query.socketID
    }

    const bearerHeader = req.query.authToken;
    let authorized = false;
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        jwt.verify(bearerToken, 'secretkey', (err, authData) => {
            if (err) {
                res.status(403).json(err);
            } else {
                if(authData.userName == userData.userName){
                    authorized = true;
                }else{
                    res.status(403);
                }
            }
        });

        if (authorized == true) {
            let socketIDstatus = await chatboxHelper.socketIDUpdate(req.query.userName, req.query.socketID);
        }

        next();
    } else {
        res.status(404).json("unAuthorized");
    }

}

//export all of the routers 
module.exports = router;