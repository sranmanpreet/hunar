const mongoose = require('mongoose');

const PriceListSchema = mongoose.Schema({
    artType: {
        type: String,
        required: "Art Type can't be empty",
        minlength: [2, 'Too small First name'],
        maxlength: [20, 'Too large First name']
    },
    artSize: {
        type: String,
        required: "Art Size can't be empty",
        minlength: [2, 'Too small Last name'],
        maxlength: [20, 'Too large Last name']
    },
    personCount: {
        type: Number,
        required: "Person count is required",
        min: 1,
        max: 4
    },
    price: {
        type: Number,
        required: 'Price is required',
        min: 1
    }
});

PriceListSchema.index({ artType: 1, artSize: 1, personCount: 1 }, { unique: true });

module.exports = mongoose.model('PriceList', PriceListSchema);