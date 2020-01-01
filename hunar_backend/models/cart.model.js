const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
    userId: {
        type: String,
        sparse: true
    },
    cartItems: [{
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
        img: {
            data: Buffer,
            contentType: String
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
        },
        expectedDeliveryDate: {
            type: Date
        },
        instructionsToArtist: {
            type: String
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
    }
});

//Events
CartSchema.pre('save', function(next) {
    this.subtotal = this.calculateCartSubtotal(this.cartItems);
    this.shippingCost = this.calculateShippingCost(this.subtotal);
    this.tax = this.calculateTax(this.subtotal);
    this.total = this.calculateCartTotal(this.subtotal, this.tax, this.shippingCost);
    next();
});



// Methods
CartSchema.methods.calculateCartSubtotal = function(cartItems) {
    var subtotal = 0;
    cartItems.forEach(element => {
        subtotal = subtotal + element.price * element.quantity;
    });
    return Math.round(subtotal);
}

CartSchema.methods.calculateShippingCost = function(subtotal) {
    return Math.round(subtotal * process.env.SHIPPING_COST_PERCENTAGE);
}

CartSchema.methods.calculateTax = function(subtotal) {
    return Math.round(subtotal * process.env.TAX_PERCENTAGE);
}

CartSchema.methods.calculateCartTotal = function(subtotal, tax, shippingCost) {
    return Math.round(subtotal + tax + shippingCost);
}

CartSchema.methods.calculations = function() {
    this.subtotal = this.calculateCartSubtotal();
    this.shippingCost = this.calculateShippingCost();
    this.tax = this.calculateTax();
    this.total = this.calculateCartTotal();
}

module.exports = mongoose.model('Cart', CartSchema);