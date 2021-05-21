//importing modules
const express = require('express');
const router = new express.Router();
var path = require('path');

// @type    GET
//@route    /reset
// @desc    for sending reset page
// @access  PUBLIC
router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'./../views/'+'reset.html'));
})

module.exports = router;


