const mongoose = require('mongoose');

const User = mongoose.model('User');
const Advertisement = mongoose.model('Advertisement');

module.exports.createAdvertisementLead = async (req, res, next) => {
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

    let newAdvertisementLead = new Advertisement({
        name: name,
        email: email,
        message: req.body.message
    });

    newAdvertisementLead.save((err, request) => {
        if (err) {
            return res.status(400).json({
                status: false,
                message: err.errors.message.message
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Advertisement Lead created",
                requestId: request._id
            });
        }
    });
}

module.exports.getAdvertisementLeads = (req, res, next) => {
    if (req.session.userId) {
        User.findOne({
            _id: req.session.userId
        }, (err, user) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    message: err.message+ " ErrorCode-2101"
                });
            } else {
                Advertisement.find({
                    email: user.email
                }, (err, advertisements) => {
                    if (err) {
                        return res.status(400).json({
                            status: false,
                            message: err.message + " ErrorCode-2102"
                        });
                    } else if(advertisements.length === 0){
                        return res.status(201).json();
                    } else {
                        return res.status(200).json(advertisements);
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