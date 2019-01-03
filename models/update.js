var db=require('./db')
var jwt=require("jsonwebtoken");
var secret="123456";
var exp_time=3600;
module.exports=(req,res)=>{

const uid=req.body.uid
const question=req.body.question
const answer=req.body.answer
subject_code=req.body.subject_code
//res.send(question+answer);
var token=req.body.token
if(req.body.token=null||req.body.token==undefined){
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

var sql='INSERT INTO '+subject_code+' (uid,question,answer,subject_code) VALUES ("'+uid+'","'+question+'","'+answer+'","'+subject_code+'")'
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
success:true,
status:200
})
console.log("1 record inserted");}
})}})}}