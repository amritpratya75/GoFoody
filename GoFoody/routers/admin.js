const express = require('express');
const router  = express.Router();
const dbConn = require('../config/connection');

router.post('/auth',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    dbConn.query('Select * from admin where username=?',[username],function(err,result,fields){
       if(err) throw err;
       else{
           if(result.length>0){
            if(password==result[0].password){
                const {id, username} = result[0]; 
                res.json({
                    status:true,
                    message:'Successfully authenticated',
                    data:{id, username}
                })
            }else{
                res.json({
                    status:false,
                    message:"Username and password does not match"
                   });
            }
           }
           else{
            res.json({
                status:false,    
              message:"Username does not exits"
            });
          }
       }
    });
})

module.exports = router;