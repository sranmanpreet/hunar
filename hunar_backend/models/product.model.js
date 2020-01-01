const mongoose = require('mongoose');


const Product = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
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