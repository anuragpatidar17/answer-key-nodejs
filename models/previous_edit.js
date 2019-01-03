var db=require('./db')
var jwt=require("jsonwebtoken");
var secret="123456";
var exp_time=3600;
module.exports=(req,res)=>{
const subject_code=req.body.subject_code
const id=req.body.id
const token=req.body.token
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
var sql='SELECT * FROM '+subject_code+' WHERE id='+id+''
db.query(sql, function (err,result) {
if (err) {
console.log(err);}
else{
console.log(result);
res.json(result);
}
})
}
}
)}}