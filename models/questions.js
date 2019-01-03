var db=require('./db')
var jwt=require("jsonwebtoken");
var secret="123456";
var exp_time=3600;

module.exports=(req,res)=>{

const uid=req.body.uid;
const subject_code=req.body.subject_code
console.log(uid);
var token=req.body.token
if(token==null||token==undefined){
res.json({
status:401,
success:false,
message:"Unauthorized access"
})
}
else{
jwt.verify(token,secret,(err, decoded) => {
if(err){
console.log(decoded);
res.json({
status:500,
success:false,
message:"Failed to authenticate token"
})
}
//console.log(decoded);
else{
console.log(decoded)
var sql='SELECT * FROM '+subject_code+' WHERE uid="'+uid+'"' 
db.query(sql,function(err,result){
if (err) {
console.log(err);}
else{
console.log(result);
res.json(result);
}
})
}})}};