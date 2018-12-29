var express = require('express');//imports express js
var bodyParser = require('body-parser');//enable the express app to read the incoming body
var logger = require('morgan');//for logging all http request 
var methodOverride = require('method-override')//allows to use put and delete request
var mysql = require('mysql');
var cors = require('cors');//cross origin resource sharing enables ionic to communicate with server
var Bcrypt = require('bcrypt');
var http = require('http');

var jwt = require('jsonwebtoken');
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

    // app.get('/main',(req,res)=>{
    //     res.sendfile(__dirname + "/main.html");
    // })}

  



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
    
     
            
            var sql='SELECT name,password,department,email FROM admin WHERE email="'+email+'"'
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
                email1=result[0].email;
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
                       const token = jwt.sign({'email': email, 'password': password}, '123456', { expiresIn: '1h'} ,(err,token) => {
                            res.json({
                                token,
                                status:200,
                                success:true,
                               name:name,
                               department:department,
                               email:email1
                               
                            });
                            
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
    const subject_code=req.body.subject_code
    console.log(uid);
con.connect(function(err){
var sql='SELECT * FROM '+subject_code+' WHERE uid="'+uid+'"' 
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

    app.post('/update',verifyToken,(req,res)=>{
        jwt.verify(req.token, '123456', (err, authData) => {
            if(err){
                res.sendStatus(403);
            } else{
                res.json({
                    message :'ok',
                   
                     authData
                })
            }
        })

        const uid=req.body.uid
        const question=req.body.question
        const answer=req.body.answer
        subject_code=req.body.subject_code
        //res.send(question+answer);
      
        var sql='INSERT INTO '+subject_code+' (uid,question,answer,subject_code) VALUES ("'+uid+'","'+question+'","'+answer+'","'+subject_code+'")'
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


              app.post('/edit_subject',(req,res)=>{
                const id=req.body.id
                const uid=req.body.uid
                const question=req.body.question
                const answer=req.body.answer
             const subject_code=req.body.subject_code
        
                var sql='UPDATE '+subject_code+' SET uid ="'+uid+'" , question = "'+question+'", answer = "'+answer+'"  WHERE id="'+id+'"'
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
                        console.log("1 record updated");}
                      });});

              app.get('/subjects', (req,res)=>{
                  


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



        app.post('/previousedit',(req,res)=>{
const subject_code=req.body.subject_code
const id=req.body.id
            var sql='SELECT * FROM '+subject_code+' WHERE id='+id+''
            con.query(sql, function (err,result) {
                if (err) {
                    console.log(err);}
                    else{
                   console.log(result);
                   res.json(result);
                    }
        })
    })




        app.post('/new_subject',function(req,res){
            const subject_code=req.body.subject_code
            const subject_name=req.body.subject_name
            console.log(subject_code,subject_name)
            var sql='CREATE TABLE '+subject_code+'  (id INT NOT NULL AUTO_INCREMENT, uid INT(10), question VARCHAR(255), answer VARCHAR(255),subject_code VARCHAR(255), PRIMARY KEY(id))';
            con.query(sql,(err,result)=>{
                if(err){
                    console.log(err)
                }
                else{
                    console.log(subject_code+" "+"table created");
                   var sql1='INSERT INTO subject (subject_code,name) VALUES ("'+subject_code+'","'+subject_name+'")'
                   con.query(sql1,(err,result)=>{
                       if (err)
                       console.log(err)
                       else{
             console.log("subject inserted")
                       }
                   })
                   
                }
            })
            })  

       
            app.post('/edit_subject',(req,res)=>{
                const id=req.body.id
                const uid=req.body.uid
                const question=req.body.question
                const answer=req.body.answer
             const subject_code=req.body.subject_code
        
                var sql='UPDATE '+subject_code+' SET uid ="'+uid+'" , question = "'+question+'", answer = "'+answer+'"  WHERE id="'+id+'"'
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
                        console.log("1 record updated");}
                      });});
            

function verifyToken(req,res,next) {
    const checktoken = req.headers['authorization'];

    if(typeof checktoken !== 'undefined'){

        const splittoken = checktoken.split(' ');

        const collecttoken = splittoken[1];
        req.token = collecttoken;

        next();

    } else{
        res.sendStatus(403);
    }
}




    app.listen(process.env.PORT||9000);
