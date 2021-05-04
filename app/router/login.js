const express = require('express');
const router = new express.Router();
var path = require('path');
const helperFunction = require('./../serverSideJs/loginHelper');

//jwt
const jwt = require("jsonwebtoken");

router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'./../views/'+'login.html'));
});

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

    // let authTokenTest;
    
    if(loginState[0]=="correct"){
        responseObj.logInfo="Success";
        responseObj.userName=profileValues.username;
        responseObj.authToken="Bearer "+loginState[1];
        // jwt.sign({responseObj},'secretkey',{expiresIn:'3000s'},(err,token)=>{
        //     authTokenTest = token;
        //     res.status(200).json({
        //         success: true,
        //         token: "Bearer " + token
        //       });
        //     res.status(200).json(responseObj); 
        // });
    }else if(loginState=="incorrect"){
        responseObj.logInfo="Fail";
    }else if(loginState=="notExists"){
        responseObj.logInfo="Fail";
    }
    
    res.status(200).json(responseObj);
    // res.json(responseObj);
});

module.exports = router;