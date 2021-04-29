const express = require('express');
const router = new express.Router();
var path = require('path');
const helperFunction = require('./../serverSideJs/loginHelper');

//jwt
const jwt = require("jsonwebtoken");


router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'./../views/'+'login.html'));
})

router.post('/', async (req,res)=>{
    const profileValues = { username: "", password: "" };
    if (req.body.username != "" && req.body.password != "") {
        profileValues.username = req.body.userName;
        profileValues.password = req.body.Password;
    }

    console.log("Values in server object");
    console.log(profileValues);

    let loginState = await helperFunction.loginProfile(profileValues.username,profileValues.password);
    console.log("loginState",loginState);
    
    let responseObj = {
        logInfo:"",
        userName:"",
        authToken:""
    }

    let authTokenTest;
    
    if(loginState=="correct"){
        responseObj.logInfo="Success";
        responseObj.userName=profileValues.username;
        jwt.sign({responseObj},'secretkey',{expiresIn:'300s'},(err,token)=>{
            
             authTokenTest = token;
            console.log("authTokenTest:"+authTokenTest);
            console.log(typeof token);
            console.log("SecretKey"+token);
            res.status(200).json({token});
        });
            
    }else if(loginState=="incorrect"){
        responseObj.logInfo="Fail";
    }else if(loginState=="notExists"){
        responseObj.logInfo="Fail";
    }
    
    responseObj.authToken = authTokenTest;
    //res.status(200).json(responseObj);
});

module.exports = router;