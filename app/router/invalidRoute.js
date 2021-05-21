//importing modules
const express = require('express');
const router = new express.Router();
var path = require('path');

// @type    GET
//@route    Any invalid route
// @desc    for sending error page
// @access  PUBLIC
router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'./../views/'+'invalidPage.html'));
});

// @type    POST
//@route    Any invalid route
// @desc    for sending error page
// @access  PUBLIC
router.post('/',function(req,res){
    res.sendFile(path.join(__dirname+'./../views/'+'invalidPage.html'));
});


module.exports = router;