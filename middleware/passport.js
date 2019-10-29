const passport    = require('passport');
const passportJWT = require("passport-jwt");
const bcrypt = require('bcrypt'); 

const LocalStrategy = require('passport-local').Strategy;

const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy   = passportJWT.Strategy;

const UserModel = require('../models/users')

var secretKey = 'nodeRestApi';
module.exports = {
    'secretKey': secretKey
}

// used to serialize the user for the session
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
// used to deserialize the user
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});


passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, cb) {
            return UserModel.findOne({email})
                .then(user => {
                    if (!user) {
                        return cb(null, false, {message: 'Incorrect email or password.'});
                    }
                    else{
                        bcrypt.compare(password, user.password, function(err, res) {
                            if (err) return cb(err);
                            if (res === false) {
                                return cb(null, false);
                            } else {
                                return cb(null, user, {
                                    message: 'Logged In Successfully'
                                });
                            }
                        });                      
                    }
                })
                .catch(err => {
                    return cb(err);
            });
    }
));

passport.use(new JWTStrategy({
    secretOrKey : secretKey,
    jwtFromRequest : ExtractJWT.fromHeader('secret_token')
  }, async (token, done) => {
    try {
        return UserModel.findById(token.user._id)
        .then(user => {
            if (!user) {
                return done(null, false, {message: "Something's wrong"});
            }
            else {
                return done(null,user)
            }
        })
    //   return done(null, token.user);
    } catch (error) {
      done(error);
    }
  }));