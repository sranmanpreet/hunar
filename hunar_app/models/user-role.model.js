const mongoose = require('mongoose');

var userRoleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: "Role is required"
    }
});

mongoose.model('User-Role', userRoleSchema);