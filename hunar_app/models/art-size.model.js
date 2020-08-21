const mongoose = require('mongoose');


const ArtSizeSchema = mongoose.Schema({
    value: {
        type: String,
        unique: true,
        required: "Art Size Value is required.",
        validate: [/^[a-zA-Z0-9 ]{1,30}$/, 'No special characters are allowed.']
    }
});

module.exports = mongoose.model('ArtSize', ArtSizeSchema);