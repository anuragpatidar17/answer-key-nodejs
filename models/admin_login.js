var db=require('./db')
var Bcrypt = require('bcrypt');
var jwt=require("jsonwebtoken");
var secret="123456"
var exp_time=360000
module.exports=(req,res)=>{
const email=req.body.email
const password=req.body.password
var hashedPassword;
var name;

var department;



var sql='SELECT name,password,department,email FROM admin WHERE email="'+email+'"'
db.query(sql, function (err,result) {
if (result.length<1) {
//console.log(err);
res.json({
status:404,
success:false,
token:null
})
}
else {
if(result[0].password==null)
{
res.json({
status:400,
success:false,
token:null
})
}
else{
hashedPassword = result[0].password;	
name=result[0].name;
department=result[0].department;
email1=result[0].email;
Bcrypt.compare(password, hashedPassword, (err, result) => {
if (err) {
console.log('Bcrypt - error - ', err);
//res.status(400);
res.json({
status:400,
success:false,
token:null
})
} else {
console.log('Bcrypt - result - ', result);
if(result==true){
jwt.sign({'email': email, 'department': department},secret, { expiresIn: exp_time} ,(err,token) => {
// res.status(200);

res.json({
status:200,
success:true,
name:name,
department:department,
email:email1,
token:token
})

})}
else {
//res.status(400);
res.json({
status:400,
success:false,
token:null
})
}
}})}}

})

}