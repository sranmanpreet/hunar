const mongoose = require('mongoose');


const Product = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true
    },
    productImage: {
        data: Buffer,
        contentType: String
    },
    pricing: {
        artType: [{
            lookupName: String,
            artSize: [{
                lookupName: String,
                price: Number
            }]
        }]
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Product', Product);