const mongoose = require('mongoose');


const ArtSizeSchema = mongoose.Schema({
    value: {
        type: String,
        unique: true
    }
});

module.exports = mongoose.model('ArtSize', ArtSizeSchema);