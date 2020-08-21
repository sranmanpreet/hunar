const mongoose = require('mongoose');

const Country = mongoose.model('Country');
const State = mongoose.model('State');
const City = mongoose.model('City');

const AddressSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: "First name can't be empty",
        minlength: [2, 'Too small First name'],
        maxlength: [20, 'Too large First name']
    },
    lastName: {
        type: String,
        required: "Last name can't be empty",
        minlength: [2, 'Too small Last name'],
        maxlength: [20, 'Too large Last name']
    },
    addressLine1: {
        type: String,
        required: "Address line 1 can't be empty",
        minlength: [2, 'Too small AddressLine1'],
        maxlength: [50, 'Maximum 50 characters in AddressLine2']
    },
    addressLine2: {
        type: String,
        maxlength: [50, 'Maximum 50 characters in AddressLine2']
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: City,
        required: "City is required."
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: State,
        required: "State is required."
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Country,
        required: "Country is required."
    },
    postalCode: {
        type: String,
        required: "Postal code can't be empty",
        maxlength: 6
    },
    phone: {
        type: String,
        required: "Phone can't be empty"
    },
    email: {
        type: String,
        required: "Email is a required field"
    }
});

// Custom validation for email
AddressSchema.path('email').validate((val) => {
    emailRegex = /^[._0-9a-zA-Z_]+@[a-zA-Z_]+?\.[.a-zA-Z]{2,6}$/;
    //    emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return emailRegex.test(val);
}, 'Invalid email');

module.exports = mongoose.model('Address', AddressSchema);