const express = require('express');
const router = new express.Router();
var path = require('path');
const registerHelper = require('./../serverSideJs/registerHelper');

router.get('/', function (req, res) {
    // console.log("Sending Reg page");
     res.sendFile(path.join(__dirname + './../views/' + 'register.html'));
});

router.post('/', async (req, res) => {
    // console.log("Posting request");
    // console.log(req.body);
    // console.log(req.body.userName + " " + req.body.Password + " " + req.body.email);
    const profileValues = { username: "", password: "" ,email:""};
    if (req.body.username != "" && req.body.password != "" && req.body.email != "") {
        profileValues.username = req.body.userName;
        profileValues.password = req.body.Password;
        profileValues.email = req.body.email;
    }

    //console.log("Values in server object");
    //console.log(profileValues);

    let fpv = await registerHelper.findProfile(profileValues.username,profileValues.email);
    // console.log("fpv:", fpv);
    if(fpv=="exists"){
        // console.log("Profile exists cannot create new");
        res.status(200).json("Profile exists");
    }else{
        let cpv = await registerHelper.createProfile(profileValues.username,profileValues.password,profileValues.email);
        //call email sender here
        // console.log(cpv);
        res.status(200).json("Success");
    }

});

module.exports = router;
