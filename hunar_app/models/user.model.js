const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
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
    googleId: String,
    password: {
        type: String,
        required: "Password can't be empty",
        minlength: [8, 'Password must be atleast eight characters long'],
        maxlength: [16, 'Password should not exceed 16 characters in length'],
    },
    role: {
        type: String,
        required: "Role is required",
        default: "Customer"
    },
    saltSecret: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

// Custom validation for email
userSchema.path('email').validate((val) => {
    //   emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    emailRegex = /^[._0-9a-zA-Z_]+@[a-zA-Z_]+?\.[.a-zA-Z]{2,6}$/;
    return emailRegex.test(val);
}, 'Invalid email');

//Events
userSchema.pre('save', function(next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});


// Methods
userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

userSchema.methods.generateJwt = function() {
    return jwt.sign({
        _id: this._id,
        role: this.role
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXP
    });
}

mongoose.model('User', userSchema);