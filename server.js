const express = require('express');
const logger = require('morgan');
const users = require('./routes/users');
const index = require('./routes/index')
const bodyParser = require('body-parser');
const mongoose = require('./config/database'); //database configuration
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();

const passport = require('passport');
require('./middleware/passport')
app.use(session({secret: 'iloveyou'})); // chuối bí mật đã mã hóa coookie
app.use(passport.initialize());
app.use(passport.session());

// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.get('/', function(req, res){
res.json({"1612278" : "Build REST API with node.js"});
});
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// public route
app.use('', index);
app.use('/users',users);

// private route
app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

// function validateUser(req, res, next) {
//   jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
//     if (err) {
//       res.json({status:"error", message: err.message, data:null});
//     }else{
//       // add user id to request
//       req.body.userId = decoded.id;
//       next();
//     }
//   });
// }

// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function(req, res, next) {
 let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// handle errors
app.use(function(err, req, res, next) {
 console.log(err);
 
  if(err.status === 404)
   res.status(404).json({message: "Not found"});
  else 
    res.status(500).json({message: "Something looks wrong :( !!!"});
});

app.set( 'port', ( process.env.PORT || 5000 ));
// Start node server
app.listen(app.get( 'port' ), function(){
 console.log('Node server listening on port ' + app.get( 'port' ));
});