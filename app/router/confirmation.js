const express = require('express');
const router = new express.Router();
var path = require('path');

//jwt test
const jwt = require("jsonwebtoken");


router.get('/:token', async function (req, res) {

    try{
        let confirmationToken = req.params.token;
        console.log("confirmationToken"+confirmationToken);
        let checkHeader = await verifyToken(confirmationToken);
        console.log("checkHeader Status:",checkHeader);
    }catch(e){
        console.log(e);
        res.send(e);
    }

    // console.log("Sending Reg page");
    //res.sendFile(path.join(__dirname + './../views/' + 'register.html'));
    res.write('<h1>Correct ConFIRmatION Page</h1>');
    res.send();
});


async function verifyToken(token) {
    let authorized = false;
    if (typeof token !== 'undefined') {
        // console.log("req.token = Bearer token");
        await jwt.verify(token, 'secretkey', (err, authData) => {
            if (err) {
                console.log("Forbidden error" + err);
                return err;
            } else {
                console.log("Auth Data:", authData);
                authorized = true;
                return true;
                // console.log("Everything is good UPDATE SOCKET ID NOW");
            }
        });

    } else {
        console.log("invalid token");
        return falase;
    }

    if(authorized){
        return authorized;
    }else{
        return authorized;
    }

}

module.exports = router;