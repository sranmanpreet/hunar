const mongoose = require('mongoose');
const passport = require('passport');
const nodemailer = require('nodemailer');
const async = require('async');
const crypto = require('crypto');
const _ = require('lodash');

const User = mongoose.model('User');
const Cart = mongoose.model('Cart');

module.exports.register = (req, res, next) => {
    passport.authenticate('local.register', {
        successRedirect: '/user/profile',
        failureRedirect: '/user/register'
    }, (err, flag, info) => {
        if (flag) return res.status(200).json(info);
        else return res.status(400).json(info);
    })(req, res);
}

module.exports.login = (req, res, next) => {

    passport.authenticate('local.signin', {
        successRedirect: '/user/profile',
        failureRedirect: '/user/signin'
    }, (err, flag, user) => {
        // err from passport middleware
        if (!flag) {
            return res.status(401).json({
                status: false,
                message: user
            });
        }
        // registered user
        else {
            req.session.userId = user._id;
            let cartMessage = '';
            if (req.session.cartId) {
                Cart.findOne({
                    _id: req.session.cartId
                }, (err, cartTemp) => {
                    if (cartTemp) {
                        Cart.findOne({
                            userId: req.session.userId
                        }, (err, cartUser) => {
                            if (cartUser) {
                                for (let i = 0; i < cartTemp.cartItems.length; i++) {
                                    let itemPresent = false;
                                    for (let j = 0; j < cartUser.cartItems.length; j++) {
                                        if (cartTemp.cartItems[i].name === cartUser.cartItems[j].name && cartTemp.cartItems[i].artType === cartUser.cartItems[j].artType && cartTemp.cartItems[i].artSize === cartUser.cartItems[j].artSize) {
                                            itemPresent = true;
                                            cartUser.cartItems[j].quantity = cartTemp.cartItems[i].quantity + cartUser.cartItems[j].quantity;
                                            if (cartUser.cartItems[j].quantity > 5) {
                                                cartUser.cartItems[j].quantity = 5;
                                            }
                                            break;
                                        }

                                    }
                                    if (!itemPresent) {
                                        cartUser.cartItems.push(cartTemp.cartItems[i]);
                                    }
                                }

                                cartUser.save((err, cartFinal) => {
                                    if (err) {
                                        cartMessage = "Alert! Cart refreshed. No items retained from current cart."
                                    } else {
                                        cartMessage = "Cart items retained."
                                        Cart.deleteOne({
                                            _id: req.session.cartId
                                        }, (err, result) => {
                                            if (!err) {
                                                req.session.cartId = '';
                                                res.cookie('jwt', user.generateJwt());
                                                return res.status(200).json({
                                                    status: true,
                                                    message: cartMessage
                                                });
                                            }

                                        });
                                    }
                                });
                            } else {
                                cartTemp.userId = req.session.userId;
                                cartTemp.save((err, cartFinal) => {
                                    if (err) {
                                        cartMessage = "Cart refreshed. No items retained from current cart."
                                    } else {
                                        cartMessage = "Cart items retained."
                                    }
                                    req.session.cartId = '';
                                    res.cookie('jwt', user.generateJwt());
                                    return res.status(200).json({
                                        status: true,
                                        message: cartMessage
                                    });
                                });
                            }
                        });
                    }
                });
            } else {
                res.cookie('jwt', user.generateJwt());
                return res.status(200).json({
                    status: true,
                    message: "No items present in cart for retention"
                });
            }
        }
    })(req, res);
}

module.exports.forgotPasswordSendEmail = (req, res, next) => {
    async.waterfall([
        (done) => {
            crypto.randomBytes(40, (err, buf) => {
                const token = buf.toString('hex');
                done(err, token);
            });
        },
        (token, done) => {
            User.findOneAndUpdate({
                email: req.body.email
            }, {
                $set: {
                    "resetPasswordToken": token,
                    "resetPasswordExpires": Date.now() + 3600000
                }
            }, (err, user) => {
                if (!user) {
                    return res.status(404).send(req.body.email + ' is not a registered user.');
                } else {
                    done(err, token, user);
                }
            })
        },
        (token, user, done) => {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
            transporter.sendMail({
                    from: '"Inderjit Chitterkar" <' + process.env.EMAIL_USER + '> ', // sender address
                    to: user.email, // list of receivers
                    subject: 'Inderjit Chitterkar - Password Reset', // Subject line
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' + req.headers.origin + '/reset-password?token=' + token + '\n\n' +
                        'If you did not request this, please ignore this email and  your password will remain unchanged', // plain text body
                },
                (err, info) => {
                    if (info) {
                        res.status(200).send('Password reset link sent.');
                    } else {
                        res.send(err);
                    }

                });
        }
    ], (err) => {
        if (err) return next(err);
    });
}

module.exports.resetPassword = (req, res, next) => {
    if (req.body.password === req.body.cpassword) {
        User.findOne({
            resetPasswordToken: req.params.token
        }, (err, user) => {
            if (!user) {
                return res.status(401).json({
                    status: false,
                    message: 'Sorry, your password reset link is invalid.'
                });
            } else {
                if (user.resetPasswordExpires > Date.now()) {
                    user.password = req.body.password;
                    user.resetPasswordExpires = Date.now();
                    user.save(function(err, doc) {
                        if (err) {
                            return res.status(500).json({
                                status: false,
                                message: "Something went wrong. Couldn't update your password. If problem persists, please contact administrator. Error Code- PR2002"
                            });
                        } else {
                            return res.status(200).json({
                                status: true,
                                message: 'Password changed successfully.'
                            });
                        }
                    });
                } else {
                    return res.status(401).json({
                        status: false,
                        message: 'Sorry, your password reset link has expired.'
                    });
                }
            }
        });
    } else {
        return res.status(422).json({
            status: false,
            message: 'Password and Confirm Password does not match'
        });
    }

}

module.exports.userProfile = (req, res, next) => {
    User.findOne({
        _id: req.user._id
    }, (err, user) => {
        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User record not found.'
            });
        } else {
            return res.status(200).json({
                status: true,
                user: _.pick(user, ['firstName', 'lastName', 'email'])
            });
        }
    });
}

module.exports.updateUserDetails = (req, res, next) => {
    User.updateOne({
            _id: req._id
        }, {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
            }
        },
        function(err, user) {
            if (!err) {
                return res.status(200).json({
                    status: true,
                    user: _.pick(user, ['firstName', 'lastName', 'email'])
                });
            } else {
                return res.status(500).json({
                    status: false,
                    message: "Something went wrong. Couldn't update your profile. Please try after some time. ErrorCode-2001"
                });
            }
        }
    );
}

module.exports.updatePassword = (req, res, next) => {
    if (req.session.userId) {
        User.findOne({
            _id: req.session.userId
        }, function(err, user) {
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: "User is not registered."
                });
            } else {
                user.password = req.body.password;
                user.save(function(err, doc) {
                    if (err) {
                        return res.status(500).json({
                            status: false,
                            message: "Something went wrong. Couldn't update your password. If problem persists, please contact administrator. Error Code- 2002"
                        });
                    } else {
                        return res.status(200).json({
                            status: true,
                            message: "Password updated."
                        });
                    }
                });
            }
        });
    } else {
        res.status(400).json({
            message: "User is not logged in."
        });
    }
}

module.exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (!err) {
            res.status(200).json({
                message: "Logged out successfully"
            });
        } else {
            res.status(500).json({
                status: false,
                message: "Something went wrong. Couldn't logout. Please try after some time. ErrorCode- 2003"
            })
        }
    });
}