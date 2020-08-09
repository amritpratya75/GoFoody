const express = require('express');
const router = express.Router();
const dbConn = require('../config/connection');



router.post('/save', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var msg = req.body.msg;
    dbConn.query('insert into feedback(name,email,msg) values(?,?,?)', [name, email, msg], function(error, result, fields) {
        if (error) throw error;
        return res.json({ data: result });
    });
});


router.get('/showFeed', function(req, res) {
    dbConn.query('Select * from feedback', function(error, result, fields) {
        if (error) throw error;
        return res.json({ data: result });
    });
});

module.exports = router;