const mysql =  require('mysql');
var dbConn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'restaurant'
});
dbConn.connect((err)=>{
    if(!err)
    console.log("Connected");
    else
    console.log("Connection Failed");
});

module.exports = dbConn;