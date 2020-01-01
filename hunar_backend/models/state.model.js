const mongoose = require('mongoose');


const StateSchema = mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    name: String,
    country_id: String
});

module.exports = mongoose.model('State', StateSchema);