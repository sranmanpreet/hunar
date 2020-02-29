const mongoose = require('mongoose');

const Product = mongoose.model('Product');

module.exports.getProducts = (req, res, next) => {
    Product.find({ pricing: { $gt: [] }, url: { $ne: null } }, function(err, galleryImages) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(galleryImages);
        }
    });
}

module.exports.getAllProducts = (req, res, next) => {
    Product.find(function(err, galleryImages) {
        res.json(galleryImages);
    });
}

module.exports.getProduct = (req, res, next) => {
    Product.findOne({ _id: req.params.itemId }, function(err, galleryImage) {
        if (galleryImage) {
            res.status(200).json(galleryImage);
        } else {
            res.status(404).send('Product not found');
        }
    });
}

module.exports.addProduct = (req, res, next) => {
    console.log(req.file);
    let newProduct = new Product({
        name: req.body.name,
        url: req.file.path,
        description: req.body.description,
    });

    newProduct.save((err, product) => {
        if (err) {
            res.status(500).json({
                status: false,
                message: 'Failed to add product. ErrorCode- 1001',
                error: err
            });
        } else {
            res.send(product);
        }
    });
}

module.exports.updateProduct = (req, res, next) => {
    Product.findOneAndUpdate({ _id: req.params.id }, { $set: { name: req.body.name, description: req.body.description } }, { new: true }, function(err, product) {
        if (err) {
            res.send(err);
        } else {
            res.send(product);
        }
    })
}

module.exports.addPricingToProduct = async(req, res, next) => {
    const product_id = req.params.productId;
    let pricing = {
        artType: req.body.artType,
        artSize: req.body.artSize,
        price: req.body.price
    };

    if (pricing.artType && pricing.artSize && pricing.price) {
        let duplicatePricing;
        await Promise.resolve(checkIfDuplicatePricingExist(product_id, pricing)).then((val) => { duplicatePricing = val; });
        if (!duplicatePricing) {
            Product.findOneAndUpdate({ _id: product_id }, { $push: { pricing: pricing } }, { new: true },
                function(err, result) {
                    if (err) {
                        res.status(400).send(err.message);
                    } else {
                        res.status(201).send(result);
                    }
                });
        } else {
            res.status(403).send("Pricing already exists");
        }
    } else {
        res.status(400).send("ArtType, ArtSize or Price can't be empty");
    }

}

module.exports.updatePricingOnProduct = async(req, res, next) => {
    const product_id = req.params.productId;
    const pricing_id = req.params.id;

    let pricing = {
        artType: req.body.artType,
        artSize: req.body.artSize,
        price: req.body.price
    };

    let duplicatePricing;
    await Promise.resolve(checkIfDuplicatePricingExist(product_id, pricing, pricing_id)).then((val) => { duplicatePricing = val; });

    if (!duplicatePricing) {
        Product.findOneAndUpdate({
                _id: product_id
            }, {
                $set: {
                    "pricing.$[row].artType": pricing.artType,
                    "pricing.$[row].artSize": pricing.artSize,
                    "pricing.$[row].price": pricing.price
                }
            }, {
                new: true,
                arrayFilters: [{ "row._id": pricing_id }]
            },
            function(err, product) {
                if (err) {
                    res.status(400).send(err.message);
                } else {
                    res.status(201).send(product);
                }
            }
        );
    } else {
        res.status(205).send("Pricing already exists");
    }
}

module.exports.deletePricing = (req, res, next) => {
    const product_id = req.params.productId;
    const pricing_id = req.params.id;
    Product.findOneAndUpdate({ _id: product_id }, {
            $pull: {
                pricing: { _id: pricing_id }
            }
        }, {
            new: true
        },
        function(err, product) {
            if (err) {
                res.send(err);
            } else {
                res.send(product);
            }
        });
}

module.exports.deleteProduct = (req, res, next) => {
    Product.remove({
        _id: req.params.id
    }, function(err, result) {
        if (err) {
            res.status(500).json({
                status: false,
                message: "Unable to delete product. ErrorCode- 1002",
                error: err
            });
        } else {
            res.status(200).json({
                status: true,
                message: "Product deleted"
            });
        }
    });
}

async function checkIfDuplicatePricingExist(productId, newPrice, existingPricingId) {
    let pricingExist = false;
    await Product.findOne({ _id: productId }, (err, product) => {
        if (err) {
            pricingExist = false;
        }
        if (product) {
            let productPrices = product.pricing;
            let productPricesSize = productPrices.length;
            for (let i = 0; i < productPricesSize; i++) {
                if (existingPricingId != undefined) {
                    if (productPrices[i]._id == existingPricingId) {
                        pricingExist = false;
                        break;
                    }
                }
                if (productPrices[i].artType === newPrice.artType) {
                    if (productPrices[i].artSize === newPrice.artSize) {
                        pricingExist = true;
                        break;
                    }
                }
            }
        }
    });
    return pricingExist;
}