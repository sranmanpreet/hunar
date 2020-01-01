const mongoose = require('mongoose');


const CountrySchema = mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    sortname: String,
    name: String,
    phoneCode: Number
});

module.exports = mongoose.model('Country', CountrySchema);
