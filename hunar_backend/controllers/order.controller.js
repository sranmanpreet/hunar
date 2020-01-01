const mongoose = require('mongoose');

const Order = mongoose.model('Order');
const User = mongoose.model('User');
const Cart = mongoose.model('Cart');
const Address = mongoose.model('Address');

module.exports.createOrder = (req, res, next) => {
    if (req.session.userId) {
        User.findOne({
            _id: req.session.userId
        }, (err, user) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    message: "User is not registered.",
                    error: err.message
                });
            } else {
                if (req.body.paymentReferenceId === '123456') {
                    let shippingAddress;
                    let billingAddress;
                    Address.findOne({
                        _id: req.body.shippingAddressId
                    }, (err, shipAddress) => {
                        if (err) {
                            return res.status(400).json({
                                status: false,
                                message: 'Shipping address not found.',
                                error: err.message
                            });
                        } else {
                            shippingAddress = shipAddress;
                            Address.findOne({
                                _id: req.body.billingAddressId
                            }, (err, billAddress) => {
                                if (err) {
                                    return res.status(400).json({
                                        status: false,
                                        message: 'Billing address not found.',
                                        error: err.message
                                    });
                                } else {
                                    billingAddress = billAddress;
                                    Cart.findOne({
                                        userId: req.session.userId
                                    }, (err, cart) => {
                                        if (!cart) {
                                            return res.status(404).json({
                                                status: false,
                                                message: "No cart items found. Please add items to cart to place order.",
                                            });
                                        } else {
                                            let newOrder = new Order({
                                                orderItems: cart.cartItems,
                                                shippingAddress: shippingAddress,
                                                billingAddress: billingAddress,
                                                email: user.email,
                                                paymentMethod: req.body.paymentMethod,
                                                paymentReferenceId: req.body.paymentReferenceId,
                                                status: 'Placed'
                                                //                           deliveryDate: date.setDate(date.getDate() + 20)
                                            });
                                            newOrder.save((err, order) => {
                                                if (err) {
                                                    return res.status(500).json({
                                                        status: false,
                                                        message: "Failed to place order. If problem persists, please contact administrator. ErrorCode- 8001",
                                                        error: err.message
                                                    });
                                                } else {
                                                    Cart.deleteOne({
                                                        userId: req.session.userId
                                                    }, (err) => {
                                                        if (!err) {
                                                            req.session.cartId = '';
                                                            return res.status(200).json(order);
                                                        }
                                                    });
                                                }
                                            });

                                        }
                                    });

                                }
                            });
                        }
                    });
                } else {
                    res.status(500).json({
                        message: "Payment reference id is incorrect."
                    });
                }
            }
        })
    } else if (req.session.cartId) {
        if (req.body.paymentReferenceId === '123456') {
            let shippingAddress;
            let billingAddress;
            Address.findOne({
                _id: req.body.shippingAddressId
            }, (err, shipAddress) => {
                if (err) {
                    return res.status(400).json({
                        status: false,
                        message: 'Shipping address not found.',
                        error: err.message
                    });
                } else {
                    shippingAddress = shipAddress;
                    Address.findOne({
                        _id: req.body.billingAddressId
                    }, (err, billAddress) => {
                        if (err) {
                            return res.status(400).json({
                                status: false,
                                message: 'Billing address not found.',
                                error: err.message
                            });
                        } else {
                            billingAddress = billAddress;
                            Cart.findOne({
                                _id: req.session.cartId
                            }, (err, cart) => {
                                if (err) {
                                    return res.status(404).json({
                                        status: false,
                                        message: "No cart found",
                                        error: err.message
                                    });
                                } else {
                                    let date = new Date();
                                    let newOrder = new Order({
                                        orderItems: cart.cartItems,
                                        shippingAddress: shippingAddress,
                                        billingAddress: billingAddress,
                                        email: req.body.email,
                                        paymentMethod: req.body.paymentMethod,
                                        paymentReferenceId: req.body.paymentReferenceId,
                                        status: 'Placed'
                                        //                   deliveryDate: date.setDate(date.getDate() + 20)
                                    });
                                    newOrder.save((err, order) => {
                                        if (err) {
                                            return res.status(500).json({
                                                status: false,
                                                message: "Failed to place order. If problem persists, please contact administrator. ErrorCode- 8001",
                                                error: err.message
                                            });
                                        } else {
                                            Cart.deleteOne({
                                                _id: req.session.cartId
                                            }, (err) => {
                                                if (!err) {
                                                    req.session.cartId = '';
                                                    return res.status(200).json(order);
                                                }
                                            });
                                        }
                                    });
                                }
                            });

                        }
                    });
                }
            });
        } else {
            res.status(500).json({
                message: "Payment reference id is incorrect."
            });
        }

    } else {
        return res.status(404).json({
            status: false,
            message: "No cart items found. Please add items to cart to place order."
        });
    }
}

module.exports.getOrders = (req, res, next) => {
    if (req.session.userId) {
        User.findOne({
            _id: req.session.userId
        }, (err, user) => {
            if (err) {
                return res.status(401).json({
                    status: false,
                    message: err.message
                });
            } else {
                Order.find({
                    email: user.email
                }).populate('shippingAddress').populate('billingAddress').exec((err, orders) => {
                    if (err) {
                        return res.status(201).json();
                    } else {
                        return res.status(200).json(orders);
                    }
                });
            }
        });
    } else {
        return res.status(401).json({
            status: false,
            message: "User is not logged in"
        });
    }
}

module.exports.getOrder = (req, res, next) => {
    if (req.session.userId) {
        User.findOne({
            _id: req.session.userId
        }, (err, user) => {
            if (err) {
                return res.status(401).json({
                    status: false,
                    message: err.message
                });
            } else {
                Address.find({
                    email: user.email
                }, (err, addresses) => {
                    if (err) {
                        return res.status(201).json({
                            status: false,
                            message: "No saved addresses found",
                            error: err.message
                        });
                    } else {
                        return res.status(200).json({
                            status: true,
                            message: "Addresses found",
                            addresses: addresses
                        });
                    }
                })
            }
        });
    } else {
        return res.status(400).json({
            status: false,
            message: "User is not logged in"
        });
    }
}

module.exports.cancelOrder = (req, res, next) => {
    if (req.session.userId) {
        User.findOne({
            _id: req.session.userId
        }, (err, user) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    message: err.message
                });
            } else {
                Order.findOne({
                    _id: req.body.orderId
                }, (err, order) => {
                    if (err)
                        return res.status(500).json({
                            status: false,
                            message: err.message
                        });
                    else if (order) {
                        if (order.status == 'Cancelled') {
                            return res.status(201).json({
                                status: false,
                                message: "Order is already cancelled"
                            });
                        }
                        if (order.status != 'Placed')
                            return res.status(201).json({
                                status: false,
                                message: "Work intiated for the order. Order can't be cancelled"
                            });
                        else {
                            Order.updateOne({
                                _id: req.body.orderId
                            }, {
                                $set: {
                                    status: 'Cancelled'
                                }
                            }, (err, result) => {
                                if (err) {
                                    return res.status(500).json({
                                        status: false,
                                        message: err.message
                                    });
                                } else {
                                    return res.status(200).json({
                                        status: true,
                                        message: "Order cancelled"
                                    });
                                }
                            });
                        }
                    } else {
                        return res.status(500).json({
                            status: false,
                            message: "Order not found"
                        });
                    }

                })

            }
        });
    } else {
        return res.status(400).json({
            status: false,
            message: "User is not logged in"
        });
    }
}