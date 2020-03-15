const mongoose = require('mongoose');
const CircularJSON = require('circular-json');

const User = mongoose.model('User');
const Country = mongoose.model('Country');
const State = mongoose.model('State');
const City = mongoose.model('City');
const Address = mongoose.model('Address');

module.exports.addAddress = (req, res, next) => {
    if (req.session.userId) {
        User.findOne({
            _id: req.session.userId
        }, (err, user) => {
            if (err) {
                return res.status(404).json({
                    status: false,
                    message: "User is not registered",
                    error: err.message
                });
            } else {
                let newAddress = new Address({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    addressLine1: req.body.addressLine1,
                    addressLine2: req.body.addressLine2,
                    city: req.body.city,
                    state: req.body.state,
                    country: req.body.country,
                    postalCode: req.body.postalCode,
                    phone: req.body.phone,
                    email: user.email
                });

                newAddress.save((err, address) => {
                    if (err) {
                        return res.status(500).json({
                            status: false,
                            message: 'Failed to save address. If problem persists, please contact administerator. ErrorCode- 7001',
                            error: err.message
                        });
                    } else {
                        Address.findOne({
                            _id: address._id
                        }).populate('city').populate('state').populate('country').exec((err, addressFound) => {
                            if (addressFound) {
                                return res.status(200).json(addressFound);
                            } else {
                                return res.status(500).json(err);
                            }
                        });
                    }
                });
            }
        })

    } else if (req.session.cartId) {
        if (req.body.email) {
            let newAddress = new Address({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                addressLine1: req.body.addressLine1,
                addressLine2: req.body.addressLine2,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country,
                postalCode: req.body.postalCode,
                phone: req.body.phone,
                email: req.body.email
            });

            newAddress.save((err, address) => {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        message: 'Failed to save address. If problem persists, please contact administerator. ErrorCode- 7001',
                        error: err.message
                    });
                } else {
                    Address.findOne({
                        _id: address._id
                    }).populate('city').populate('state').populate('country').exec((err, addressFound) => {
                        if (addressFound) {
                            return res.status(200).json(addressFound);
                        } else {
                            return res.status(500).json(err);
                        }
                    });
                }
            });
        } else {
            return res.status(400).json({
                status: false,
                message: "Email id is required"
            });
        }
    }

}

module.exports.getAddress = (req, res, next) => {
    if (req.session.userId) {
        User.findOne({
            _id: req.session.userId
        }, (err, user) => {
            if (err) {
                return res.status(401).json({
                    status: false,
                    message: "User is not registered",
                    error: err.message
                });
            } else {
                Address.find({
                    email: user.email
                }).populate('city').populate('state').populate('country').exec((err, addresses) => {
                    if (err) {
                        return res.status(201).json({
                            status: false,
                            message: "No saved addresses found"
                        });
                    } else {
                        return res.status(200).json(addresses);
                    }
                });
            }
        })
    } else if (req.session.cartId) {
        res.status(200).json();
    } else {
        res.status(401).json({
            status: false,
            message: "User is not logged in"
        });
    }
}

module.exports.deleteAddress = (req, res, next) => {
    if (req.session.userId) {
        User.findOne({
            _id: req.session.userId
        }, (err, user) => {
            if (err)
                return res.status(401).json({
                    status: false,
                    message: "User is not registered"
                });
            else {
                Address.deleteOne({
                    _id: req.params.id
                }, function (err) {
                    if (err) {
                        res.status(500).json({
                            status: false,
                            message: "Coudn't delete address. If problem persists, please contact administerator. ErrorCode- 7004",
                            error: err.message
                        });
                    } else {
                        return res.status(200).json({
                            status: true,
                            message: "Address deleted"
                        });
                    }
                });
            }
        })
    } else {
        return res.status(401).json({
            message: "User is not logged in."
        });
    }
}

module.exports.getCountries = (req, res, next) => {
    Country.find((err, countries) => {
        if (!countries) {
            return null;
        } else {
            return res.status(200).json(countries);
        }
    });
}

module.exports.getCountry = (req, res, next) => {
    Country.findOne({
            id: req.params.id
        },
        (err, country) => {
            if (!country) {
                return null;
            } else {
                return res.status(200).json(country);
            }
        });
}

module.exports.getStates = (req, res, next) => {
    State.find({
        country_id: req.params.countryId
    }, (err, states) => {
        if (!states) {
            return null;
        } else {
            return res.status(200).json(states);
        }
    });
}
module.exports.getState = (req, res, next) => {
    State.findOne({
        id: req.params.stateId,
        country_id: req.params.countryId
    }, (err, states) => {
        if (!states) {
            return null;
        } else {
            return res.status(200).json(states);
        }
    });
}

module.exports.getCities = (req, res, next) => {
    City.find({
        state_id: req.params.stateId
    }, (err, cities) => {
        if (!cities) {
            return null;
        } else {
            return res.status(200).json(cities);
        }
    });
}

module.exports.getCity = (req, res, next) => {
    City.findOne({
        id: req.params.cityId
    }, (err, city) => {
        if (!city) {
            return null;
        } else {
            return res.status(200).json(city);
        }
    });
}