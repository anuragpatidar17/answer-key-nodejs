var express = require('express');//imports express js
var bodyParser = require('body-parser');//enable the express app to read the incoming body
var logger = require('morgan');//for logging all http request 
var methodOverride = require('method-override')//allows to use put and delete request
var cors = require('cors');//cross origin resource sharing enables ionic to communicate with server
var Bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var app = express();
var db=require('./models/db')
var config=require('./config/config')
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride());
app.use(cors());
var register=require('./models/admin_req')
var login=require('./models/admin_login')
var questions=require('./models/questions')
var subjects=require('./models/subjects')
var edit_subject=require('./models/edit_subject')
var previous_edit=require('./models/previous_edit')
var update =require('./models/update')
var new_subject = require('./models/new_subject')

app.route('/admin_reg').post(register)

    
app.route('/admin_login').post(login)

app.route('/question').post(questions)

app.route('/subjects').post(subjects)

app.route('/edit_subject').post(edit_subject)

app.route('/update').post(update);
  
app.route('/previousedit').post(previous_edit);

app.route('/new_subject').post(new_subject);  
            
app.listen(config.port.port,console.log("app running on port:",config.port.port));