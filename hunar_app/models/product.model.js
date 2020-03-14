const mongoose = require('mongoose');


const Product = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        validate: [/^[a-zA-Z0-9 ]{1,30}$/, 'No special characters are allowed.']
    },
    url: {
        type: String,
        required: true
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
        required: true,
        validate: [/^[a-zA-Z0-9 ,.']{1,1000}$/, 'No special characters are allowed.']
    }
});

module.exports = mongoose.model('Product', Product);