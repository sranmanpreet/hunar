const mongoose = require('mongoose');


const ArtTypeSchema = mongoose.Schema({
    value: {
        type: String,
        unique: true
    }
});

module.exports = mongoose.model('ArtType', ArtTypeSchema);