const mongoose = require('mongoose');

const User = mongoose.model('User');
const Support = mongoose.model('Support');

module.exports.createSupportRequest = async (req, res, next) => {
    let name = '';
    let email = '';
    if(req.session.userId){
        await User.findOne({
            _id: req.session.userId
        }, (err, user) => {
            if (err) {
                req.session.destroy();
                return res.status(403).json({
                    status: false,
                    error: err.message
                });
            } else {
                name = user.firstName;
                email = user.email;
            }
        });
    }
    else {
        name = req.body.name;
        email = req.body.email;
    }

    let newSupportRequest = new Support({
        name: name,
        email: email,
        message: req.body.message
    });

    newSupportRequest.save((err, request) => {
        if (err) {
            return res.status(500).json({
                status: false,
                error: err.message
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Support request created.",
                requestId: request._id
            });
        }
    });
}

module.exports.getSupportRequests = (req, res, next) => {
    if (req.session.userId) {
        User.findOne({
            _id: req.session.userId
        }, (err, user) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    message: err.message+ " ErrorCode-5101"
                });
            } else {
                Support.find({
                    email: user.email
                }, (err, supportRequests) => {
                    if (err) {
                        return res.status(400).json({
                            status: false,
                            message: err.message + " ErrorCode-5102"
                        });
                    } else if(supportRequests.length === 0){    
                        return res.status(201).json();
                    } else {
                        return res.status(200).json(supportRequests);
                    }
                });
            }
        });
    } else {
        return res.status(400).json({
            status: false,
            message: "User is not logged in"
        });
    }
}