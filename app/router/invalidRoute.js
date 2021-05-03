const express = require('express');
const router = new express.Router();
var path = require('path');

router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'./../views/'+'invalidPage.html'));
});

router.post('/',function(req,res){
    res.sendFile(path.join(__dirname+'./../views/'+'invalidPage.html'));
});


module.exports = router;