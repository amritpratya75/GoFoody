const express = require('express');
const router  = express.Router();
const dbConn = require('../config/connection');

router.get('/',function(req,res){
    res.send("WELCOME TO THE FIRST PAGE");
});

router.post('/search',function(req,res){
    var city = req.body.city;
    dbConn.query('Select * from restaddress where city = ?',[city],function(error,result,fields){
        if(error) throw error;
        return res.json({data:result});
    });
});

module.exports = router;