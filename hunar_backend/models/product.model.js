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
    description: {
        type: String,
        required: true
    },
    pricing: [{
        artType: {
            type: String,
            required: "Art Type is required."
        },
        artSize: {
            type: String,
            required: "Art Size is required."
        },
        price: {
            type: Number,
            required: "Price is required."
        }
    }]
});

module.exports = mongoose.model('Product', Product);