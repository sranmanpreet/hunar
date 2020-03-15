const mongoose = require('mongoose');


const ArtTypeSchema = mongoose.Schema({
    value: {
        type: String,
        unique: true,
        required: "Art Type Value is required.",
        validate: [/^[a-zA-Z0-9 ]{1,30}$/, 'No special characters are allowed.']
    }
});

module.exports = mongoose.model('ArtType', ArtTypeSchema);