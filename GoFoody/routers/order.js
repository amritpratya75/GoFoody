const express = require('express');
const router = express.Router();
const dbConn = require('../config/connection');


router.get('/show/:id', function(req, res) {
    var id = req.params.id;
    dbConn.query('select id,date_time,cname,cphone,caddress,cemail,schedule,notes,name,quantity,price,branch_address,branch_contact from orderf o Join custdet c on o.id = c.orderid Join fooddet f on o.id = f.orderid where o.userid=?;', id, function(err, result, field) {
        if (err) throw err;
        return res.json(result);
    })
})

router.get('/showAll', function(req, res) {
    dbConn.query('select id,cname,cphone,caddress,cemail,schedule,notes,name,quantity,price,branch_address,branch_contact from orderf o Join custdet c on o.id = c.orderid Join fooddet f on o.id = f.orderid;', function(err, result, field) {
        if (err) throw err;
        return res.json(result);
    })
})


router.post('/details', function(req, res) {
    var userid = req.body.userid;
    var restid = req.body.restid;
    var schedule = req.body.schedule;
    var notes = req.body.notes;
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var branch_address = req.body.branch_address;
    var branch_contact = req.body.branch_contact;
    var flag = 0;
    dbConn.query('insert into OrderF(userid,restid,flag,schedule,notes,date_time,branch_address,branch_contact) values(?,?,?,?,?,?,?,?)', [userid, restid, flag, schedule, notes, date, branch_address, branch_contact], function(error, result, fields) {
        if (error) throw error;
        return res.json(result);
    });
});

router.post('/custdet', function(req, res) {
    var cname = req.body.cname;
    var cphone = req.body.cphone;
    var caddress = req.body.caddress;
    var cemail = req.body.cemail;
    var orderid = req.body.orderid;
    dbConn.query('insert into CustDet(cname,cphone,caddress,cemail,orderid) values(?,?,?,?,?)', [cname, cphone, caddress, cemail, orderid], function(error, result, fields) {
        if (error) throw error;
        return res.json(result);
    });
});

router.post('/fooddet', function(req, res) {
    var orderid = req.body.orderid;
    var quantity = req.body.quantity;
    var name = req.body.name;
    var price = req.body.price;
    dbConn.query('insert into fooddet(orderid,quantity,name,price) values(?,?,?,?)', [orderid, quantity, name, price], function(error, result, fields) {
        if (error) throw error;
        return res.json(result);
    });
})

router.get('/showOnRest/:restid', function(req, res) {
    var restid = req.params.restid;
    dbConn.query('select id,date_time,cname,cphone,caddress,cemail,schedule,notes,name,quantity,price,flag from orderf o Join custdet c on o.id = c.orderid Join fooddet f on o.id = f.orderid where o.restid=?;', restid, function(err, result, field) {
        if (err) throw err;
        return res.json(result);
    })
})


module.exports = router;