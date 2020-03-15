const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


var AdminUser = new mongoose.Schema({
    firstName: {
        type: String,
        required: "First name can't be empty"
    },
    lastName: {
        type: String,
        required: "Last name can't be empty"
    },
    email: {
        type: String,
        required: "Email can't be empty",
        unique: true
    },
    password: {
        type: String,
        required: "Password can't be empty",
        minlength: [8, 'Password must be atleast eight characters long'],
        maxlength: [16, 'Password should no exceed 16 characters in length'],
    },
    saltSecret: String
});

// Custom validation for email
AdminUser.path('email').validate((val) => {
    emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return emailRegex.test(val);
}, 'Invalid email');

//Events
AdminUser.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});


// Methods
AdminUser.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

AdminUser.methods.generateJwt = function () {
    return jwt.sign({
        _id: this._id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXP
    });
}

mongoose.model('AdminUser', AdminUser);