const mongoose = require('mongoose');


const Feedback = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: 'Email Id is required.',
        minlength: 5,
        maxlength: 40
    },
    message: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 400
    },
    createdDate: {
        type: Date
    }
});

//Events
Feedback.pre('save', function (next) {
    this.createdDate = new Date();
    next();
});

// Custom validation for email
Feedback.path('email').validate((val) => {
    emailRegex = /^[._0-9a-zA-Z_]+@[a-zA-Z_]+?\.[.a-zA-Z]{2,6}$/;
    //    emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return emailRegex.test(val);
}, 'Invalid email');

module.exports = mongoose.model('Feedback', Feedback);