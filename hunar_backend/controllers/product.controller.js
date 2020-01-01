const mongoose = require('mongoose');

const Product = mongoose.model('Product');

module.exports.getProducts = (req, res, next) => {
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
    let newProduct = new Product({
        name: req.body.name,
        url: req.body.url,
        pricing: req.body.pricing,
        description: req.body.description,
    });

    newProduct.productImage.data = fs.readFileSync(req.files.productImage.path);
    newProduct.productImage.contentType = 'image/png';

    newProduct.save((err, product) => {
        if (err) {
            res.status(500).json({
                status: false,
                message: 'Failed to add image to gallery. ErrorCoce- 1001',
                error: err
            });
        } else {
            res.json({
                status: true,
                message: 'Image successfully added to gallery'
            });
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
    })
}