const express = require('express');
const router = new express.Router();
var path = require('path');
const helperFunction = require('./../serverSideJs/confirmationHelper');

//jwt test
const jwt = require("jsonwebtoken");

router.get('/:token', async function (req, res) {

    let checkHeader;
    try{
        let confirmationToken = req.params.token;
        checkHeader = await verifyToken(confirmationToken);
        if(checkHeader != false){
            helperFunction.updateEmailVerificationStatus(checkHeader)
        }
    }catch(e){
        console.log(e);
        res.send(e);
    }

    if(checkHeader!= false){
        res.write('<h1>Email Verified Enjoy The Platform</h1>');
    }else{
        res.write('<h1>Email Verification problem</h1>');
    }
    res.send();
});

async function verifyToken(token) {
    let authorized = false;
    let email;
    if (token !== undefined) {
        // console.log("req.token = Bearer token");
        await jwt.verify(token, 'secretkey', (err, authData) => {
            if (err) {
                console.log("Forbidden error" + err);
                return err;
            } else {
                console.log("Auth Data:", authData);
                email = authData.email;
                authorized = true;
                return true;
                // console.log("Everything is good UPDATE SOCKET ID NOW");
            }
        });

    } else {
        console.log("invalid token");
        return false;
    }
    
    if(authorized){
        return email;
    }else{
        return false;
    }

}

module.exports = router;