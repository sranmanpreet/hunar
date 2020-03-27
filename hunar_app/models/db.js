const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASS,
    useNewUrlParser: true
}, (err) => {
    if (!err) {
        console.log('MongoDB connection succeeded.');
    } else {
        console.log('Error in MongoDB connection : ' + JSON.stringify(err, undefined, 2));
    }
});

//mongoose.Promise = global.Promise;

require('./art-size.model');
require('./art-type.model');
require('./country.model');
require('./state.model');
require('./city.model');
require('./cart.model');
require('./address.model');
require('./order.model');
require('./user-role.model');
require('./user.model');
require('./product.model');
require('./advertisement.model');
require('./support.model');
require('./feedback.model');