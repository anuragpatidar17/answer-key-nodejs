var config=require('../config/config')
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password:config.db.password,
   database:config.db.database,
 
  });
  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");})

module.exports= connection;