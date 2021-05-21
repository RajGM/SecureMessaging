//importing modules
const express = require('express');
const router = new express.Router();
var path = require('path');
const helperFunction = require('./../serverSideJs/loginHelper');

// @type    GET
//@route    /login
// @desc    for sendig login page
// @access  PUBLIC
router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'./../views/'+'login.html'));
});


// @type    POST
//@route    /login
// @desc    for posting login credentials and loggingIn user
// @access  PUBLIC
router.post('/', async (req,res)=>{
    const profileValues = { username: "", password: "" };
    if (req.body.username != "" && req.body.password != "") {
        profileValues.username = req.body.userName;
        profileValues.password = req.body.Password;
    }
    
    let loginState = await helperFunction.loginProfile(profileValues.username,profileValues.password);
    console.log("LOGIN STATE:"+loginState);

    let responseObj = {
        logInfo:"",
        userName:"",
        authToken:""
    }
    
    if(loginState[0]=="correct"){
        responseObj.logInfo="Success";
        responseObj.userName=profileValues.username;
        responseObj.authToken="Bearer "+loginState[1];
    }else if(loginState=="incorrect"){
        responseObj.logInfo="Fail";
    }else if(loginState=="notExists"){
        responseObj.logInfo="Fail";
    }
    
    res.status(200).json(responseObj);
});

module.exports = router;