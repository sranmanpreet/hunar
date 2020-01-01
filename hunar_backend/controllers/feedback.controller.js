const mongoose = require('mongoose');

const User = mongoose.model('User');
const Feedback = mongoose.model('Feedback');

module.exports.createFeedback = async (req, res, next) => {
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

    let newFeedback = new Feedback({
        name: name,
        email: email,
        message: req.body.message
    });

    newFeedback.save((err, request) => {
        if (err) {
            return res.status(500).json({
                status: false,
                error: err.message
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Feedback saved",
                requestId: request._id
            });
        }
    });
}

module.exports.getFeedbacks = (req, res, next) => {
    if (req.session.userId) {
        User.findOne({
            _id: req.session.userId
        }, (err, user) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    message: err.message+ " ErrorCode-6101"
                });
            } else {
                Feedback.find({
                    email: user.email
                }, (err, feedbacks) => {
                    if (err) {
                        return res.status(400).json({
                            status: false,
                            message: err.message + " ErrorCode-6102"
                        });
                    } else if(feedbacks.length === 0){
                        return res.status(201).json();
                    } else {
                        return res.status(200).json(feedbacks);
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