const mongoose = require('mongoose');
const _ = require('lodash');
const fs = require('fs');

const Cart = mongoose.model('Cart');
const User = mongoose.model('User');
const PriceList = mongoose.model('PriceList');
const Product = mongoose.model('Product');

module.exports.getShoppingCartItems = (req, res, next) => {
    if (req.session.userId) {
        User.findOne({
                _id: req.session.userId
            },
            (errUser, user) => {
                if (user) {
                    Cart.findOne({
                        userId: req.session.userId
                    }, (errCart, cart) => {
                        if (cart) {
                            res.status(200).json(cart);
                        } else {
                            res.status(200).json();
                        }
                    })
                } else {
                    req.session.destroy((err) => {
                        if (err) {
                            res.status(500).json({
                                status: false,
                                message: "Can't destroy session. ErrorCode- 6001",
                                error: err.message
                            });
                        } else {
                            res.status(404).json({
                                status: false,
                                message: "Invalid session"
                            });
                        }
                    });
                }
            });
    } else if (req.session.cartId) {
        Cart.findOne({
            _id: req.session.cartId
        }, (errCart, cart) => {
            if (cart)
                res.status(200).json(cart);
            else
                res.status(200).json();

        })
    } else {
        res.status(200).json();
    }
}

module.exports.addShoppingCartItem = async(req, res, next) => {
    const productId = req.body.productId;
    const productType = req.body.productType;
    const productArtType = req.body.artType;
    const productArtSize = req.body.artSize;
    const productQuantity = productType == 'Gallery' ? req.body.quantity : 1;
    const personCount = parseInt(req.body.personCount);
    const expectedDeliveryDate = req.body.expectedDeliveryDate;
    const instructionsToArtist = req.body.instructionsToArtist;
    let productImgUrl;
    let productName;
    let productPrice;

    let fetchedProduct = null;

    if (productType == 'Gallery' && !productId) {
        res.status(400).send("Bad data");
    } else if (productType == 'Gallery' && productId) {
        await Product.findOne({ _id: productId }).then(result => fetchedProduct = result);
        productName = fetchedProduct.name;
        productImgUrl = fetchedProduct.url;
        if (fetchedProduct) {
            productPrice = getProductPrice(fetchedProduct, productArtType, productArtSize);
        } else {
            return res.status(422).send("Product not found");
        }

    } else if (productType == 'Make To Order') {
        productName = req.body.name;
        productImgUrl = req.body.imgurl
        await getMakeToOrderProductPrice(productArtType, productArtSize, personCount >= 0 ? personCount : 0)
            .then(
                (priceList) => {
                    if (priceList) {
                        productPrice = priceList.price
                    } else {
                        deleteImageByPath(process.env.PRODUCT_IMAGES_BASE_PATH + productImgUrl);
                        return res.status(422).send("Pricing is not available for requested Art Type, Size and Person count combination.");
                    }
                });
    }
    if (productPrice) {
        if (req.session.userId) {
            User.findOne({
                    _id: req.session.userId
                },
                (errUser, user) => {
                    if (errUser) {
                        req.session.destroy((err) => {
                            if (err) {
                                res.status(500).json({
                                    status: false,
                                    message: "Can't destroy session. ErrorCode- 6002",
                                    error: err.message
                                });
                            } else {
                                res.status(404).json({
                                    status: false,
                                    message: "Invalid session"
                                });
                            }
                        });
                    }
                    if (user) {
                        Cart.findOne({
                            userId: user._id
                        }, (errCart, cart) => {
                            if (!cart) {
                                let newCart = new Cart({
                                    userId: user._id,
                                    subtotal: 0,
                                    shippingCost: 0,
                                    tax: 0,
                                    total: 0
                                });
                                newCart.save((errCartSave, cart) => {
                                    if (errCartSave) return res.status(500).json({
                                        status: false,
                                        message: "Something went wrong. Please try again later. ErrorCode- 6003",
                                        error: errCartSave.message
                                    });
                                    else {
                                        let cItems = cart.cartItems;
                                        let itemPresent = false;
                                        for (let i = 0; i < cItems.length; i++) {
                                            if (cItems[i].name === productName && cItems[i].artType === productArtType && cItems[i].artSize === productArtSize) {
                                                itemPresent = true;
                                                cItems[i].quantity = cItems[i].quantity + productQuantity;
                                                if (cItems[i].quantity > 5) {
                                                    cItems[i].quantity = 5;
                                                }
                                                let subtotal = cart.calculateCartSubtotal(cItems);
                                                let shippingCost = cart.calculateShippingCost(subtotal);
                                                let tax = cart.calculateTax(subtotal);
                                                let total = cart.calculateCartTotal(subtotal, tax, shippingCost);
                                                cart.subtotal = subtotal;
                                                cart.shippingCost = shippingCost;
                                                cart.tax = tax;
                                                cart.total = total;
                                                cart.save((err, updatedCart) => {
                                                    if (updatedCart) {
                                                        return res.status(200).json(updatedCart);
                                                    } else {
                                                        return res.status(500).json({
                                                            status: false,
                                                            message: "Unable to add item to cart. If problem persists, please contact administrator. ErrorCode: 6004",
                                                            err: err
                                                        });
                                                    }
                                                });
                                            }
                                        }

                                        if (!itemPresent) {
                                            let newCartItem = {
                                                productType: productType,
                                                name: productName,
                                                imgurl: productImgUrl,
                                                artType: productArtType,
                                                artSize: productArtSize,
                                                quantity: productQuantity,
                                                price: productPrice,
                                                expectedDeliveryDate: expectedDeliveryDate,
                                                instructionsToArtist: instructionsToArtist
                                            };
                                            cItems.push(newCartItem);
                                            let subtotal = cart.calculateCartSubtotal(cItems);
                                            let shippingCost = cart.calculateShippingCost(subtotal);
                                            let tax = cart.calculateTax(subtotal);
                                            let total = cart.calculateCartTotal(subtotal, tax, shippingCost);

                                            cart.subtotal = subtotal;
                                            cart.shippingCost = shippingCost;
                                            cart.tax = tax;
                                            cart.total = total;
                                            cart.save((err, updatedCart) => {
                                                if (updatedCart) {
                                                    return res.status(200).json(updatedCart);
                                                } else {
                                                    return res.status(500).json({
                                                        status: false,
                                                        message: "Unable to add item to cart. If problem persists, please contact administrator. ErrorCode: 6005",
                                                        error: err
                                                    })
                                                }
                                            });
                                        }
                                    }
                                })
                            } else {
                                let cItems = cart.cartItems;
                                let itemPresent = false;
                                for (let i = 0; i < cItems.length; i++) {
                                    if (cItems[i].productType === 'Gallery' && cItems[i].name === productName && cItems[i].artType === productArtType && cItems[i].artSize === productArtSize) {
                                        itemPresent = true;
                                        cItems[i].quantity = cItems[i].quantity + productQuantity;
                                        if (cItems[i].quantity > 5) {
                                            cItems[i].quantity = 5;
                                        }
                                        let subtotal = cart.calculateCartSubtotal(cItems);
                                        let shippingCost = cart.calculateShippingCost(subtotal);
                                        let tax = cart.calculateTax(subtotal);
                                        let total = cart.calculateCartTotal(subtotal, tax, shippingCost);
                                        cart.subtotal = subtotal;
                                        cart.shippingCost = shippingCost;
                                        cart.tax = tax;
                                        cart.total = total;
                                        cart.save((err, updatedCart) => {
                                            if (updatedCart) {
                                                return res.status(200).json(updatedCart);
                                            } else {
                                                return res.status(500).json({
                                                    status: false,
                                                    message: "Unable to add item to cart. If problem persists, please contact administrator. ErrorCode: 6006",
                                                    err: err
                                                });
                                            }
                                        });
                                    }
                                }

                                if (!itemPresent) {
                                    let newCartItem = {
                                        productType: productType,
                                        name: productName,
                                        imgurl: productImgUrl,
                                        artType: productArtType,
                                        artSize: productArtSize,
                                        quantity: productQuantity,
                                        price: productPrice,
                                        expectedDeliveryDate: expectedDeliveryDate,
                                        instructionsToArtist: instructionsToArtist
                                    };
                                    cItems.push(newCartItem);
                                    let subtotal = cart.calculateCartSubtotal(cItems);
                                    let shippingCost = cart.calculateShippingCost(subtotal);
                                    let tax = cart.calculateTax(subtotal);
                                    let total = cart.calculateCartTotal(subtotal, tax, shippingCost);

                                    cart.subtotal = subtotal;
                                    cart.shippingCost = shippingCost;
                                    cart.tax = tax;
                                    cart.total = total;
                                    cart.save((err, updatedCart) => {
                                        if (updatedCart) {
                                            return res.status(200).json(updatedCart);
                                        } else {
                                            return res.status(500).json({
                                                status: false,
                                                message: "Unable to add item to cart. If problem persists, please contact administrator. ErrorCode: 6007",
                                                error: err
                                            })
                                        }
                                    });
                                }
                            }
                        });

                    }
                }
            );
        } else if (req.session.cartId) {
            Cart.findOne({
                _id: req.session.cartId
            }, (errCart, cart) => {
                if (cart) {
                    let cItems = cart.cartItems;
                    let itemPresent = false;
                    for (let i = 0; i < cItems.length; i++) {
                        if (cItems[i].productType === "Gallery" && cItems[i].name === productName && cItems[i].artType === productArtType && cItems[i].artSize === productArtSize) {
                            itemPresent = true;
                            cItems[i].quantity = cItems[i].quantity + productQuantity;
                            if (cItems[i].quantity > 5) {
                                cItems[i].quantity = 5;
                            }
                            let subtotal = cart.calculateCartSubtotal(cItems);
                            let shippingCost = cart.calculateShippingCost(subtotal);
                            let tax = cart.calculateTax(subtotal);
                            let total = cart.calculateCartTotal(subtotal, tax, shippingCost);
                            cart.subtotal = subtotal;
                            cart.shippingCost = shippingCost;
                            cart.tax = tax;
                            cart.total = total;
                            cart.save((err, updatedCart) => {
                                if (updatedCart) {
                                    return res.status(200).json(updatedCart);
                                } else {
                                    return res.status(500).json({
                                        status: false,
                                        message: "Unable to add item to cart. If problem persists, please contact administrator. ErrorCode: 6008",
                                        err: err
                                    });
                                }
                            });
                        }
                    }

                    if (!itemPresent) {
                        let newCartItem = {
                            productType: productType,
                            name: productName,
                            imgurl: productImgUrl,
                            artType: productArtType,
                            artSize: productArtSize,
                            quantity: productQuantity,
                            price: productPrice,
                            expectedDeliveryDate: expectedDeliveryDate,
                            instructionsToArtist: instructionsToArtist
                        };

                        cItems.push(newCartItem);
                        let subtotal = cart.calculateCartSubtotal(cItems);
                        let shippingCost = cart.calculateShippingCost(subtotal);
                        let tax = cart.calculateTax(subtotal);
                        let total = cart.calculateCartTotal(subtotal, tax, shippingCost);

                        cart.subtotal = subtotal;
                        cart.shippingCost = shippingCost;
                        cart.tax = tax;
                        cart.total = total;
                        cart.save((err, updatedCart) => {
                            if (updatedCart) {
                                return res.status(200).json(updatedCart);
                            } else {
                                return res.status(500).json({
                                    status: false,
                                    message: "Unable to add item to cart. If problem persists, please contact administrator. ErrorCode: 6009",
                                    error: err
                                })
                            }
                        });
                    }

                } else {
                    req.session.destroy((err) => {
                        if (err) {
                            res.status(500).json({
                                status: false,
                                message: "Can't destroy session. ErrorCode- 6010",
                                error: err.message
                            });
                        } else {
                            res.status(404).json({
                                status: false,
                                message: "Invalid session",
                                cart: {}
                            });
                        }
                    });
                }
            });
        } else {
            let newCart = new Cart({
                subtotal: 0,
                shippingCost: 0,
                tax: 0,
                total: 0
            });
            newCart.save(async(errCartSave, cart) => {
                if (errCartSave) return res.status(500).json({
                    status: false,
                    message: "Something went wrong. Please try again later. ErrorCode- 6011",
                    error: errCartSave.message
                });
                else {
                    req.session.cartId = cart._id;
                    let cItems = cart.cartItems;
                    let newCartItem = {
                        productType: productType,
                        name: productName,
                        imgurl: productImgUrl,
                        artType: productArtType,
                        artSize: productArtSize,
                        quantity: productQuantity,
                        price: productPrice,
                        expectedDeliveryDate: expectedDeliveryDate,
                        instructionsToArtist: instructionsToArtist
                    };

                    cItems.push(newCartItem);
                    let subtotal = cart.calculateCartSubtotal(cItems);
                    let shippingCost = cart.calculateShippingCost(subtotal);
                    let tax = cart.calculateTax(subtotal);
                    let total = cart.calculateCartTotal(subtotal, tax, shippingCost);

                    cart.subtotal = subtotal;
                    cart.shippingCost = shippingCost;
                    cart.tax = tax;
                    cart.total = total;
                    cart.save((err, updatedCart) => {
                        if (updatedCart) {
                            return res.status(200).json(updatedCart);
                        } else {
                            return res.status(500).json({
                                status: false,
                                message: "Unable to add item to cart. If problem persists, please contact administrator. ErrorCode: 6012",
                                error: err
                            })
                        }
                    });

                }
            });
        }
    }
}

module.exports.deleteShoppingCartItem = (req, res, next) => {
    if (req.session.userId) {
        User.findOne({
            _id: req.session.userId
        }, (errUser, user) => {
            if (errUser) {
                req.session.destroy((err) => {
                    if (err) {
                        return res.status(500).json({
                            status: false,
                            message: "Can't destroy session. ErrorCode- 6013",
                            error: err.message
                        });
                    } else {
                        return res.status(404).json({
                            status: false,
                            message: "Invalid session"
                        });
                    }
                });
            }
            if (user) {
                Cart.findOne({
                    userId: req.session.userId
                }, (err, cart) => {
                    if (err) {
                        return res.status(500).json({
                            status: false,
                            message: "Cart not found",
                            cart: {}
                        });
                    } else {
                        deleteCartItemImageFile(cart, req.params.id);
                        Cart.updateOne({
                            userId: req.session.userId
                        }, {
                            $pull: {
                                cartItems: {
                                    _id: req.params.id
                                }
                            }
                        }, (err, cart) => {
                            if (cart.n == 0) {
                                return res.status(200).json({
                                    status: false,
                                    message: "Item doesn't exist in cart"
                                })
                            }
                            if (err) {
                                return res.status(500).json({
                                    status: false,
                                    error: err,
                                    message: "Something went wrong. Please contact administrator. ErrorCode: 6014"
                                });
                            } else {
                                Cart.findOne({
                                    userId: req.session.userId
                                }, (err, cartM) => {
                                    if (cartM) {
                                        if (cartM.cartItems.length === 0) {
                                            cartM.deleteOne({
                                                _id: req.session.cartId
                                            }, () => {
                                                req.session.destroy();
                                                return res.status(200).json(cartM);
                                            });
                                        } else {
                                            let subtotal = cartM.calculateCartSubtotal(cartM.cartItems);
                                            let shippingCost = cartM.calculateShippingCost(subtotal);
                                            let tax = cartM.calculateTax(subtotal);
                                            let total = cartM.calculateCartTotal(subtotal, tax, shippingCost);

                                            cartM.save((err, cartM2) => {
                                                if (!err) {
                                                    Cart.findOneAndUpdate({
                                                        userId: req.session.userId
                                                    }, {
                                                        subtotal: subtotal,
                                                        tax: tax,
                                                        shippingCost: shippingCost,
                                                        total: total
                                                    }, (err, cartUpdate) => {
                                                        if (cartUpdate) {
                                                            return res.status(200).json(cartUpdate)
                                                        } else return res.status(500).json({
                                                            error: err,
                                                            message: "Something went wrong. Please contact administrator. ErrorCode: 6015"
                                                        });
                                                    });
                                                }
                                            });
                                        }
                                    } else {
                                        return res.status(500).json({
                                            error: err,
                                            message: "Something went wrong. Please contact administrator. ErrorCode: 6016"
                                        });
                                    }
                                });
                            }
                        });
                    }
                });

            }
        })
    } else if (req.session.cartId) {
        Cart.findOne({
            _id: req.session.cartId
        }, (err, cart) => {
            if (cart) {
                deleteCartItemImageFile(cart, req.params.id);
                Cart.updateOne({
                    _id: req.session.cartId
                }, {
                    $pull: {
                        cartItems: {
                            _id: req.params.id
                        }
                    }
                }, (err, cart) => {
                    if (cart.n == 0) {
                        return res.status(200).json({
                            status: false,
                            message: "Item doesn't exist in cart"
                        })
                    } else if (err) {
                        return res.status(500).json({
                            status: false,
                            error: err,
                            message: "Something went wrong. Please contact administrator. ErrorCode: 6017"
                        });
                    } else
                        Cart.findOne({
                            _id: req.session.cartId
                        }, (err, cartM) => {
                            if (cartM) {
                                if (cartM.cartItems.length === 0) {
                                    cartM.deleteOne({
                                        _id: req.session.cartId
                                    }, () => {
                                        req.session.destroy();
                                        return res.status(200).json(cartM);
                                    });
                                } else {
                                    let subtotal = cartM.calculateCartSubtotal(cartM.cartItems);
                                    let shippingCost = cartM.calculateShippingCost(subtotal);
                                    let tax = cartM.calculateTax(subtotal);
                                    let total = cartM.calculateCartTotal(subtotal, tax, shippingCost);

                                    cartM.save((err, cartM2) => {
                                        if (!err) {
                                            Cart.findOneAndUpdate({
                                                userId: req.session.userId
                                            }, {
                                                subtotal: subtotal,
                                                tax: tax,
                                                shippingCost: shippingCost,
                                                total: total
                                            }, (err, cartUpdate) => {
                                                if (cartUpdate) {
                                                    return res.status(200).json(cartUpdate)
                                                } else {
                                                    return res.status(500).json({
                                                        error: err,
                                                        message: "Something went wrong. Please contact administrator. ErrorCode: 6015"
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            } else return res.status(500).json({
                                error: err,
                                message: "Something went wrong. Please contact administrator. ErrorCode: 60019"
                            });
                        });
                });

            } else {
                res.status(400).json({
                    status: false,
                    message: "Cart does not exist",
                    error: err
                });
            }

        });
    } else {
        res.status(404).json({
            status: false,
            message: "Cart is empty"
        });
    }
}

module.exports.updateCart = (req, res, next) => {
    if (req.session.userId) {
        User.findOne({
                _id: req.session.userId
            },
            (errUser, user) => {
                if (errUser) {
                    req.session.destroy((err) => {
                        if (err) {
                            return res.status(500).json({
                                status: false,
                                message: "Can't destroy session. ErrorCode- 6002",
                                error: err.message
                            });
                        } else {
                            return res.status(404).json({
                                status: false,
                                message: "Invalid session"
                            });
                        }
                    });
                } else {
                    Cart.findOne({
                        userId: user._id
                    }, (errCart, cart) => {
                        if (errCart) {
                            return res.status(401).json({
                                message: "Cart not found for the user. ErrorCode- 6001"
                            });
                        } else {
                            let count = 0;
                            let cItems = cart.cartItems;
                            for (let i = 0; i < cItems.length; i++) {
                                count = count + 1;
                                if (cItems[i]._id == req.body._id) {
                                    cItems[i].quantity = req.body.quantity;
                                    if (cItems[i].quantity > 5) {
                                        cItems[i].quantity = 5;
                                    }
                                    let subtotal = cart.calculateCartSubtotal(cItems);
                                    let shippingCost = cart.calculateShippingCost(subtotal);
                                    let tax = cart.calculateTax(subtotal);
                                    let total = cart.calculateCartTotal(subtotal, tax, shippingCost);
                                    cart.subtotal = subtotal;
                                    cart.shippingCost = shippingCost;
                                    cart.tax = tax;
                                    cart.total = total;
                                    cart.save((err, updatedCart) => {
                                        if (updatedCart) {
                                            return res.status(200).json(updatedCart);
                                        } else {
                                            return res.status(500).json({
                                                status: false,
                                                message: "Unable to update quantity. If problem persists, please contact administrator. ErrorCode: 6006",
                                                err: err
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
            }
        );
    } else if (req.session.cartId) {
        Cart.findOne({
            _id: req.session.cartId
        }, (errCart, cart) => {
            if (errCart) {
                req.session.destroy((err) => {
                    if (err) {
                        return res.status(500).json({
                            status: false,
                            message: "Can't destroy session. ErrorCode- 6001",
                            error: err.message
                        });
                    } else {
                        return res.status(404).json({
                            status: false,
                            message: "Invalid session"
                        });
                    }
                });
            } else {
                let cItems = cart.cartItems;
                for (let i = 0; i < cItems.length; i++) {
                    if (cItems[i]._id == req.body._id) {
                        if (cItems[i].productType == 'Make To Order') {
                            return res.status(422).send("Exclusive art quantity is restricted to one per order. If you want to place bulk order, please write us an email");
                        } else if (cItems[i].productType == 'Gallery') {
                            cItems[i].quantity = req.body.quantity;
                            if (cItems[i].quantity > 5) {
                                cItems[i].quantity = 5;
                            }
                            let subtotal = cart.calculateCartSubtotal(cItems);
                            let shippingCost = cart.calculateShippingCost(subtotal);
                            let tax = cart.calculateTax(subtotal);
                            let total = cart.calculateCartTotal(subtotal, tax, shippingCost);
                            cart.subtotal = subtotal;
                            cart.shippingCost = shippingCost;
                            cart.tax = tax;
                            cart.total = total;
                            cart.save((err, updatedCart) => {
                                if (updatedCart) {
                                    return res.status(200).json(updatedCart);
                                } else {
                                    return res.status(500).json({
                                        status: false,
                                        message: "Unable to update quantity. If problem persists, please contact administrator. ErrorCode: 6006",
                                        err: err
                                    });
                                }
                            });
                        } else {
                            return res.status(400).status("Invalid request");
                        }
                        break;
                    }
                }
            }
        });
    }
}

function getProductPrice(product, artType, artSize) {
    for (let i = 0; i < product.pricing.length; i++) {
        if (product.pricing[i].artType == artType && product.pricing[i].artSize == artSize) {
            return product.pricing[i].price;
        }
    }
    return res.status(422).send("Pricing not available for this art type and size combination");
}

async function getMakeToOrderProductPrice(productArtType, productArtSize, personCount) {
    return await PriceList.findOne({ artType: productArtType, artSize: productArtSize, personCount: personCount });
}

function deleteCartItemImageFile(cart, cartItemId) {
    for (let i = 0; i < cart.cartItems.length; i++) {
        if (cart.cartItems[i]._id == cartItemId && cart.cartItems[i].productType == 'Make To Order') {
            const cartImagePath = process.env.PRODUCT_IMAGES_BASE_PATH + cart.cartItems[i].imgurl;
            try {
                fs.unlinkSync(cartImagePath);
            } catch (err) {
                if (err.code === 'ENOENT') {
                    console.log('File not found at : ' + cartImagePath);
                } else {
                    console.log(err);
                }
            }
            break;
        }
    }
}

function deleteImageByPath(path) {
    try {
        fs.unlinkSync(path);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('File not found at : ' + path);
        } else {
            console.log(err);
        }
    }
}