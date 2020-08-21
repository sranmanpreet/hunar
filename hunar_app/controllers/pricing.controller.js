const mongoose = require('mongoose');

const PriceList = mongoose.model('PriceList');

module.exports.getPriceList = (req, res, next) => {
    PriceList.find().sort({ artType: 1 }).exec(function(err, pricelist) {
        res.json(pricelist);
    });
}

module.exports.addPrice = (req, res, next) => {
    let price = new PriceList({
        artType: req.body.artType,
        artSize: req.body.artSize,
        personCount: req.body.personCount,
        price: req.body.price
    });

    price.save((err, price) => {
        if (err) {
            if (err.name == "MongoError" && err.code == 11000) {
                return res.status(422).send("Record already exist");
            } else {
                return res.status(400).send("Something went wrong. Please try again later");
            }
        } else {
            res.status(200).send(price);
        }
    });
}

module.exports.deletePrice = (req, res, next) => {
    PriceList.deleteOne({ _id: req.params.id }, (err, success) => {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            return res.status(200).json({
                message: "Price deleted"
            });
        }
    })
}