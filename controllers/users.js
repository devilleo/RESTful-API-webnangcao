const userModel = require('../models/users');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const passport = require('passport');
const secretKey = require('../middleware/passport');


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
   login: function(req,res){
      passport.authenticate('local-login', {session: false}, (err, user, info) => {
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
             const body = { _id : user._id, email : user.email };
             const token = jwt.sign({user: body}, secretKey.secretKey, { expiresIn: '1h' });
             return res.json({status: "Login successful", token});
         });
     })
     (req, res);
   },
   update: function(req,res){
        userModel.findByIdAndUpdate(req.user._id, 
            {
                firstName: req.body.firstName, 
                lastName: req.body.lastName, 
                address: req.body.address, 
                city: req.body.city, 
                country: req.body.country, 
                aboutMe: req.body.aboutMe,
                profilePicture: req.body.file.path
            }, (err) => {
            if (err){
                return res.json({
                    message: "Something wrong makes update failure"
                })
            }
            return res.json({message: "Update complete"})
        })
   },
   changePassword: function(req, res){
       userModel.findById(req.user._id,function(err, doc) {
        if (err) return res.json({
            message: "Something wrong makes change password failure"
        });
        if(!bcrypt.compareSync(req.body.oldPassword, doc.password)) {
            return res.json({message: "Old password was wrong"
            });
        }
        doc.password = req.body.newPassword;
        doc.save();
        return res.json({message: "Change password complete"})
      }); 
   },
}