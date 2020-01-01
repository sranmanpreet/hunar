const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

var Cart = mongoose.model('Cart');
var User = mongoose.model('User');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});


passport.use('local.register', new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, email, password, done) => {
        User.findOne({
                email: email
            },
            (err, user) => {
                if (err) {
                    return done(null, false, {
                        error: err.message
                    });
                }
                // user already exist
                if (user) {
                    return done(null, false, {
                        status: false,
                        message: 'Email is already registered'
                    });
                }
                // success
                var newUser = new User();
                newUser.firstName = req.body.firstName;
                newUser.lastName = req.body.lastName;
                newUser.email = req.body.email;
                newUser.password = req.body.password;

                newUser.save((err, doc) => {
                    if (doc) {
                        return done(null, true, {
                            status: true,
                            message: "Registration successful"
                        })
                    } else if (err){
                        console.log(err);
                        return done(null, false, {
                            status: false,
                            message: err.message
                        });
                    }
                });
            });
    }
));


passport.use('local.signin', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({
            email: email
        },
        (err, user) => {
            if (err) {
                return done(null, false, err.message);
            }
            // unknown user
            else if (!user) {
                return done(null, false, 'Email is not registered');

            }
            // wrong password
            else if (!user.verifyPassword(password)) {
                return done(null, false, 'Wrong password');
            }
            // authentication succeeded
            else {
                return done(null, true, user);
            }
        })
}));