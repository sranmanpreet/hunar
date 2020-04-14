const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20');
const generator = require('generate-password');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const Role = require('./role');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
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
                    } else if (err) {
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

passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URL
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({
            email: profile.emails[0].value
        },
        (err, existingUser) => {
            if (err) {
                return done(null, false, err.message);
            }
            // unknown user
            else if (!existingUser) {
                const password = generator.generate({
                    length: 12,
                    numbers: true,
                    symbols: true,
                    strict: true
                });
                let newUser = {
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    password: password,
                    role: Role.Customer
                };
                newUser = new User(newUser);
                newUser.save(
                    (err, user) => {
                        if (user) {
                            return done(null, true, user);
                        } else if (err) {
                            console.log(err);
                            return done(null, false, {
                                status: false,
                                message: err.message
                            });
                        }
                    });
            } else {
                return done(null, true, existingUser);
            }
        });
}));