const express = require('express');
const router  = express.Router();
const dbConn = require('../config/connection');


router.post('/',function(req,res){
    var subTotal = req.body.subTotal;
    var mode = req.body.mode;
    var orderid = req.body.orderid;
    var userid = req.body.userid;
    dbConn.query('insert into payment(subtotal,mode,orderid,userid) values(?,?,?,?)',[subTotal,mode,orderid,userid],function(error,result,fields){
        if(error) throw error;
        return res.json(result);
   });
})

router.get('/details',function(req,res){
    dbConn.query('select subtotal,mode,orderid,name from payment p join user u on p.userid=u.id;',function(error,result,fields){
        if(error) throw error;
        return res.json(result);
   });
});

module.exports=router;