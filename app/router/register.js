//importing modules
const express = require('express');
const router = new express.Router();
var path = require('path');
const registerHelper = require('./../serverSideJs/registerHelper');

// @type    GET
//@route    /register
// @desc    for sending register page
// @access  PUBLIC
router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + './../views/' + 'register.html'));
});

// @type    POST
//@route    /register
// @desc    for sending register credentials and registering user
// @access  PUBLIC
router.post('/', async (req, res) => {
    const profileValues = { username: "", password: "" ,email:""};
    if (req.body.username != "" && req.body.password != "" && req.body.email != "") {
        profileValues.username = req.body.userName;
        profileValues.password = req.body.Password;
        profileValues.email = req.body.email;
    }
    
    let fpv = await registerHelper.findProfile(profileValues.username,profileValues.email);
    if(fpv=="exists"){
        res.status(200).json("Profile exists");
    }else{
        let cpv = await registerHelper.createProfile(profileValues.username,profileValues.password,profileValues.email);
        res.status(200).json("Success");
    }

});

module.exports = router;
