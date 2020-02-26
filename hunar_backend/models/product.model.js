const mongoose = require('mongoose');


const Product = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String
    },
    productImage: {
        data: Buffer,
        contentType: String
    },
    pricing: [{
        artType: {
            type: String,
            required: true
        },
        artSize: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Product', Product);