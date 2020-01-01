const mongoose = require('mongoose');


const Advertisement = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [2, 'Too short name'],
        maxlength: [30, 'Too long name']
    },
    email: {
        type: String,
        required: 'Email Id is required.',
        minlength: 5,
        maxlength: [50, 'Too long email address']
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
Advertisement.pre('save', function (next) {
    this.createdDate = new Date();
    next();
});

// Custom validation for email
Advertisement.path('name').validate((val) => {
    nameRegex = /^[ a-zA-Z_]{0,30}$/;
    return nameRegex.test(val);
}, 'No special characters are allowed in Name');

Advertisement.path('email').validate((val) => {
    emailRegex = /^[._0-9a-zA-Z_]+@[a-zA-Z_]+?\.[.a-zA-Z]{2,6}$/;
    //   emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return emailRegex.test(val);
}, 'Invalid email');

Advertisement.path('message').validate((val) => {
    messageRegex = /^[\n .,@:0-9a-zA-Z_]{0,400}$/;
    return messageRegex.test(val);
}, 'No special characters are allowed in Message, except _ , @ : and .');

module.exports = mongoose.model('Advertisement', Advertisement);