var db=require('./db')
var Bcrypt = require('bcrypt');
module.exports=(req,res)=>{
    console.log("api hitted");
    const name=req.body.name
    const email=req.body.email
    const department=req.body.department

    const password=req.body.password
 
    var salt = Bcrypt.genSaltSync();
    var encryptedPassword = Bcrypt.hashSync(password, salt);
    var sql_reg='SELECT name FROM admin WHERE email="'+email+'"'
    db.query(sql_reg, function (err,result) {
        if(result.length>0)
        {
            console.log(result)
            console.log("duplicate entry not allowed")
            res.json({
                status:409,
                success:false
            })}
            else{
    var sql='INSERT INTO admin (password,name,department,email) VALUES ("'+encryptedPassword+'","'+name+'","'+department+'","'+email+'")'
        db.query(sql, function (err, result) {
            if (err){
                console.log(err);
                res.json({
                    success:false,
                    status:400
                })
            }
            else 
            {
                res.json({
                    status:200,
                    success:true
 
                })
               
            console.log("1 record inserted");}
          });
         
        }})};