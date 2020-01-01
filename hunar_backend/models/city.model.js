const mongoose = require('mongoose');


const CitySchema = mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    name: String,
    state_id: String
});

module.exports = mongoose.model('City', CitySchema);
