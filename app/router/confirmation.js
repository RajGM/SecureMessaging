const express = require('express');
const router = new express.Router();
var path = require('path');
const helperFunction = require('./../serverSideJs/confirmationHelper');

//jwt test
const jwt = require("jsonwebtoken");

router.get('/:token', async function (req, res) {

    try{
        let confirmationToken = req.params.token;
        let checkHeader = await verifyToken(confirmationToken);
        if(checkHeader != false){
            helperFunction.updateEmailVerificationStatus(checkHeader)
        }
    }catch(e){
        console.log(e);
        res.send(e);
    }

    res.write('<h1>Correct ConFIRmatION Page</h1>');
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