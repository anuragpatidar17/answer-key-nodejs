var db=require('./db')
var jwt=require("jsonwebtoken");
var secret="123456";
var exp_time=3600;
 
module.exports=(req,res)=>{
    const subject_code=req.body.subject_code
    const subject_name=req.body.subject_name
    console.log(subject_code,subject_name)
    
    var sql='CREATE TABLE '+subject_code+'  (id INT NOT NULL AUTO_INCREMENT, uid INT(10), question VARCHAR(255), answer VARCHAR(255),subject_code VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql,(err,result)=>{
    if(err){
    console.log(err)
    }
    else{
    console.log(subject_code+" "+"table created");
    var sql1='INSERT INTO subject (subject_code,name) VALUES ("'+subject_code+'","'+subject_name+'")'
    db.query(sql1,(err,result)=>{
    if (err)
    console.log(err)
    else{
    console.log("subject inserted")
    }
    })
    
    }
    })
    }