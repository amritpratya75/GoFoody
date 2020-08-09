const express = require('express');
const router = express.Router();
const dbConn = require('../config/connection');


router.get('/firstmenu', function(req, res) {
    dbConn.query('select id from menu limit 1', function(error, result, fields) {
        if (error) throw error;
        return res.json(result);
    });
});

router.get('/showmenucat', function(req, res) {
    dbConn.query('Select * from menucat', function(error, result, fields) {
        if (error) throw error;
        return res.json(result);
    });
});

router.get('/category/:id', function(req, res) {
    var id = req.params.id;
    dbConn.query('Select * from menu where id=?', id, function(error, result, fields) {
        if (error) throw error;
        return res.json(result);
    });
});

router.get('/:id', function(req, res) {
    var id = req.params.id;
    dbConn.query('select * from menu where menucatid=?', id, function(err, result, fields) {
        if (err) throw err;
        return res.json({ data: result });
    });

});

router.delete('/:id', function(req, res) {
    var id = req.params.id;
    dbConn.query('delete from menu where id=?', id, function(err, result, fields) {
        if (err) throw err;
        return res.json({ data: result });
    });

});


router.post('/addmenucat', function(req, res) {
    var category = req.body.category;
    dbConn.query('insert into menucat(category) values(?)', category, function(error, result, fields) {
        if (error) throw error;
        return res.json({ data: result });
    });
});

router.post('/addmenu', function(req, res) {
    var file = req.files.image;
    file.mv('./uploads/' + file.name, function(err, result) {
        if (err) throw err;
        var name = req.body.name;
        var price = req.body.price;
        var menucatid = req.body.menucatid;
        var photo = file.name;
        dbConn.query('insert into menu(name,photo,price,menucatid) values(?,?,?,?)', [name, photo, price, menucatid], function(error, result, fields) {
            if (error) throw error;
            return res.json({ data: result });
        });
    })

});

router.delete('/deletemenucat/:id', function(req, res) {
    var id = req.params.id;
    dbConn.query('delete from menucat where id=?', id, function(err, result, fields) {
        if (err) throw err;
        return res.json({ data: result });
    });
});

router.put('/updatemenu/:id', function(req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var price = req.body.price;
    dbConn.query('UPDATE menu SET name = ?, price = ?  WHERE id = ?;', [name, price, id], function(err, result, fields) {
        if (err) throw err;
        return res.json({ data: result });
    });
});




module.exports = router;