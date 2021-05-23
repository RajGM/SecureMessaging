//importing libraries
const express = require('express');
const router = new express.Router();
var path = require('path');

// @type    GET
//@route    /
// @desc    for sendig landing page
// @access  PUBLIC
router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/app/views/'+'index.html'));
})

// @type    GET
//@route    /
// @desc    for sendig landing page
// @access  PUBLIC
router.get('/index.html',function(req,res){
    res.sendFile(path.join(__dirname+'/app/views/'+'index.html'));
})

//export router
module.exports = router;