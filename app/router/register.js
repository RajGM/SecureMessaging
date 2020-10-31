const express = require('express');
const router = new express.Router();
var path = require('path');
const helperFun = require('./../serverSideJs/registerHelper');

router.get('/', function (req, res) {
    console.log("Sending Reg page");
    res.sendFile(path.join(__dirname + './../views/' + 'register.html'));
});

router.post('/', async (req, res) => {
    console.log("Posting request");
    console.log(req.body);
    const profileValues = { username: "", password: "" };
    if (req.body.username != "" && req.body.password != "") {
        profileValues.username = req.body.userName;
        profileValues.password = req.body.Password;
    }

    console.log("Values in server object");
    console.log(profileValues);

    let fpv = await helperFun.findProfile(profileValues.username);
    console.log("fpv:", fpv);
    if(fpv=="exists"){
        console.log("Profile exists cannot create new");
        res.status(200).json("Profile exists");
    }else{
        let cpv = await helperFun.createProfile(profileValues.username,profileValues.password);
        console.log(cpv);
        res.status(200).json("Created new");
    }

});

module.exports = router;
