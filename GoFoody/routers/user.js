const express = require('express');
const router = express.Router();
const dbConn = require('../config/connection');


router.post('/edit', function(req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var contact = req.body.contact;
    dbConn.query('update user set name=?,contact=? where id=?', [name, contact, id], function(err, result, fields) {
        if (err) throw err;
        res.send({ data: result });
    });
});




router.post('/register', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var address = req.body.address;
    var contact = req.body.contact;
    dbConn.query('INSERT INTO user(name,email,password,address,contact) SELECT * FROM (SELECT ? , ? , ? ,? ,?) AS tmp WHERE NOT EXISTS ( SELECT email FROM user WHERE email = ? ) LIMIT 1;', [name, email, password, address, contact, email], function(err, result, fields) {
        if (err) throw err;
        res.send({ result });
    });
})


router.post('/authenticate', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    dbConn.query('Select * from user where email=?', [email], function(err, result, fields) {
        if (err) throw err;
        else {
            if (result.length > 0) {
                if (password == result[0].password) {
                    const { id, name, email, address, contact } = result[0];
                    res.json({
                        status: true,
                        message: 'Successfully authenticated',
                        data: { id, name, email, address, contact }
                    })
                } else {
                    res.json({
                        status: false,
                        message: "Email and password does not match"
                    });
                }
            } else {
                res.json({
                    status: false,
                    message: "Email does not exits"
                });
            }
        }
    });
})


router.post('/check', function(req, res) {
    var email = req.body.email;
    dbConn.query('Select * from user where email=?', [email], function(err, result, fields) {
        if (err) throw err;
        else {
            if (result.length > 0) {
                res.json({
                    status: true
                })
            } else {
                res.json({
                    status: false
                })
            }
        }
    })
})
module.exports = router;