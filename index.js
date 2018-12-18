var express = require('express');//imports express js
var bodyParser = require('body-parser');//enable the express app to read the incoming body
var logger = require('morgan');//for logging all http request 
var methodOverride = require('method-override')//allows to use put and delete request
var mysql = require('mysql');
var cors = require('cors');//cross origin resource sharing enables ionic to communicate with server
var Bcrypt = require('bcrypt');
var http = require('http');
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride());
app.use(cors());
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"",
   database:"myanswer",
 
  });


  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");})

    app.get('/main',(req,res)=>{
        res.sendfile(__dirname + "/main.html");
    });




    app.post('/admin_reg',(req,res)=>{
        const name=req.body.name
        const email=req.body.email
        const department=req.body.department
      
        const password=req.body.password
     
        var salt = Bcrypt.genSaltSync();
        var encryptedPassword = Bcrypt.hashSync(password, salt);
        var sql_reg='SELECT name FROM admin WHERE email="'+email+'"'
        con.query(sql_reg, function (err,result) {
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
            con.query(sql, function (err, result) {
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
             
            }})});
    

    app.post('/admin_login',(req,res)=>{
        const email=req.body.email
        const password=req.body.password
        var hashedPassword;
     var name;
    
     var department;
    
     
            
            var sql='SELECT name,password,department FROM admin WHERE email="'+email+'"'
            con.query(sql, function (err,result) {
                if (result.length<1) {
                    //console.log(err);
                    res.json({
                        status:404,
                        success:false
                    })
                 }
                 else {
                     if(result[0].password==null)
                     {
                     res.json({
                        status:400,
                        success:false
                     })
                    }
                    else{
                hashedPassword = result[0].password;	
                name=result[0].name;
                department=result[0].department;
                  Bcrypt.compare(password, hashedPassword, (err, result) => {
                      if (err) {
                         console.log('Bcrypt - error - ', err);
                         //res.status(400);
                         res.json({
                             status:400,
                             success:false
                         })
                      } else {
                         console.log('Bcrypt - result - ', result);
                         if(result==true){
                        // res.status(200);
            
                                   res.json({
                                       status:200,
                                       success:true,
                                      name:name,
                                      department:department
                    
                    
                                   })
                            
                         }
                         else {
                           //res.status(400);
                           res.json({
                               status:400,
                               success:false
                           })
                         }
                      }})}}
                     
   })

});

app.post('/details',(req,res)=>{
   var match;
   res.json(match);
    console.log(match);
con.connect(function(err){
var sql='SELECT name FROM admin WHERE email="'+match+'"' 
con.query(sql,function(err,result){
    if (err) {
        console.log(err);}
        else{
       console.log(result);
       res.json(result);
        }
})
})

})
   

app.post('/question',(req,res)=>{
   
    const uid=req.body.uid;
    console.log(uid);
con.connect(function(err){
var sql='SELECT * FROM 15ee208 WHERE uid="'+uid+'"' 
con.query(sql,function(err,result){
    if (err) {
        console.log(err);}
        else{
       console.log(result);
       res.json(result);
        }
})
})

})

    app.post('/update',(req,res)=>{

        const uid=req.body.uid
        const question=req.body.question
        const answer=req.body.answer
        //res.send(question+answer);
      
        var sql='INSERT INTO 15ee208 (uid,question,answer) VALUES ("'+uid+'","'+question+'","'+answer+'")'
            con.query(sql, function (err, result) {
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
              });});


              app.get('/showsub',(req,res)=>{
                res.sendfile("./index2.html");
            });

              app.get('/subjects',(req,res)=>{
                var sql='SELECT * FROM subject'
                con.query(sql, function (err,result) {
                    if (err) {
                        console.log(err);}
                        else{
                       console.log(result);
                       res.json(result);
                        }
            })
        })
       

       
            

    app.listen(process.env.PORT||9000);