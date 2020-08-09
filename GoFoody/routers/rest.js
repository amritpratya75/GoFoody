const express = require('express');
const router = express.Router();
const dbConn = require('../config/connection');

router.get('/showrest', function(req, res) {
    dbConn.query('Select * from restaddress', function(error, result, fields) {
        if (error) throw error;
        return res.json(result);
    });
});

router.post('/addrest', function(req, res) {
    var address = req.body.address;
    var city = req.body.city;
    var state = req.body.state;
    var pincode = req.body.pincode;
    var contact = req.body.contact;
    var owner = req.body.owner;
    var username = req.body.username;
    var password = req.body.password;
    dbConn.query('insert into restaddress(address,city,state,pincode,contact,owner,username,password) values(?,?,?,?,?,?,?,?)', [address, city, state, pincode, contact, owner, username, password], function(error, result, fields) {
        if (error) throw error;
        return res.json({ data: result });
    });
});


router.delete('/deleterest/:id', function(req, res) {
    var id = req.params.id;
    dbConn.query('delete from restaddress where rest_id=?', id, function(err, result, fields) {
        if (err) throw err;
        return res.json({ data: result });
    });
});


router.post('/auth', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    dbConn.query('Select * from restaddress where username=?', [username], function(err, result, fields) {
        if (err) throw err;
        else {
            if (result.length > 0) {
                if (password == result[0].password) {
                    const { rest_id, owner, username, address, city, state, pincode, contact } = result[0];
                    res.json({
                        status: true,
                        message: 'Successfully authenticated',
                        data: { rest_id, owner, username, address, city, state, pincode, contact }
                    })
                } else {
                    res.json({
                        status: false,
                        message: "Username and password does not match"
                    });
                }
            } else {
                res.json({
                    status: false,
                    message: "Username does not exits"
                });
            }
        }
    });
})

module.exports = router;