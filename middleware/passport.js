const passport    = require('passport');
const passportJWT = require("passport-jwt");
const bcrypt = require('bcrypt'); 

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;
const UserModel = require('../models/users')


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
            return UserModel.findOne({'email': email})
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
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : 'your_jwt_secret'
    },
    function (jwtPayload, cb) {

        //find the user in db if needed
        return UserModel.findOneById(jwtPayload.id)
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
));