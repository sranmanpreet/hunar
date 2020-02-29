const mongoose = require('mongoose');

const Address = mongoose.model('Address');

const OrderSchema = mongoose.Schema({
    email: {
        type: String,
        required: "Email can't be empty"
    },
    orderItems: [{
        productType: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        imgurl: {
            type: String,
            required: true
        },
        artType: {
            type: String,
            required: true
        },
        artSize: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            default: 0
        },
        quantity: {
            type: Number,
            required: true,
            default: 0
        }
    }],
    subtotal: {
        type: Number
    },
    shippingCost: {
        type: Number
    },
    tax: {
        type: Number
    },
    total: {
        type: Number
    },
    date: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Placed', 'In Transit', 'Cancelled', 'Delivered']
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Address,
        required: "Shipping address is required."
    },
    billingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Address,
        required: "Billing address is required."
    },
    deliveryDate: {
        type: Date
    },
    paymentMethod: {
        type: String,
        enum: ['Cash On Delivery', 'Credit Card', 'Debit Card', 'Paypal'],
        required: "Payment method is required."
    },
    paymentReferenceId: {
        type: String,
        required: "Payment Reference Id is required."
    }
});

// Custom validation for email
OrderSchema.path('email').validate((val) => {
    emailRegex = /^[._0-9a-zA-Z_]+@[a-zA-Z_]+?\.[.a-zA-Z]{2,6}$/;
    //   emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return emailRegex.test(val);
}, 'Invalid email');

//Events
OrderSchema.pre('save', function (next) {
    this.subtotal = this.calculateOrderSubtotal(this.orderItems);
    this.shippingCost = this.calculateShippingCost(this.subtotal);
    this.tax = this.calculateTax(this.subtotal);
    this.total = this.calculateCartTotal(this.subtotal, this.tax, this.shippingCost);
    this.date = new Date();
    next();
});



// Methods
OrderSchema.methods.calculateOrderSubtotal = function (orderItems) {
    var subtotal = 0;
    orderItems.forEach(element => {
        subtotal = subtotal + element.price * element.quantity;
    });
    return Math.round(subtotal);
}

OrderSchema.methods.calculateShippingCost = function (subtotal) {
    return Math.round(subtotal * process.env.SHIPPING_COST_PERCENTAGE);
}

OrderSchema.methods.calculateTax = function (subtotal) {
    return Math.round(subtotal * process.env.TAX_PERCENTAGE);
}

OrderSchema.methods.calculateCartTotal = function (subtotal, tax, shippingCost) {
    return Math.round(subtotal + tax + shippingCost);
}

module.exports = mongoose.model('Order', OrderSchema);