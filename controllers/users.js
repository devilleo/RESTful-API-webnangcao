const userModel = require('../models/users');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const passport = require('passport');

module.exports = {
    create: function(req, res, next) {
      userModel.findOne({email: req.body.email}, function(err, doc){
         if(err) throw err;
         if (doc == null){
            userModel.create({ name: req.body.name, email: req.body.email, password: req.body.password }, function (err, result) {
               if (err) 
                next(err);
               else
                res.json({status: "success", message: "User added successfully!!!", data: null});
               
             });
         }
         else {
            console.log("Failed to create new User, Email has been registed before.")
            res.json({status: "Failed", message: "Failed to create new User, Email has been registed before.", data: null})
         }
      })
    },   
   authenticate: function(req, res, next) {
     userModel.findOne({email:req.body.email}, function(err, userInfo){
        if (err) {
         next(err);
        } else {
   if(bcrypt.compareSync(req.body.password, userInfo.password)) {
    const token = jwt.sign({id: userInfo._id}, req.app.get('secretKey'), { expiresIn: '1h' });
    res.json({status:"success", message: "user found!!!", data:{user: userInfo, token:token}});
   }else{
   res.json({status:"error", message: "Invalid email/password!!!", data:null});
   }
        }
       });
   },
   login: function(req,res,next){
      passport.authenticate('local-login', {session: false}, (err, user, info) => {
         console.log(err);
         console.log(info);
         if (err || !user) {
             return res.status(400).json({
                 message: info ? info.message : 'Login failed',
                 user   : user
             });
         }
 
         req.login(user, {session: false}, (err) => {
             if (err) {
                 res.send(err);
             }
 
             const token = jwt.sign({id: user._id}, req.app.get('secretKey'), { expiresIn: '1h' });
 
             return res.json({status: "Login successful", user, token});
         });
     })
     (req, res);
   },
}