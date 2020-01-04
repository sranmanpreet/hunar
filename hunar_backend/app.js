require('./config/config');
require('./models/db');
require('./config/passportConfig');

// importing modules
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);

const productRoutes = require('./routes/product.router');
const cartRoutes = require('./routes/cart.router');
const addressRoutes = require('./routes/address.router');
const advertisementRoutes = require('./routes/advertisement.router');
const orderRoutes = require('./routes/order.router');
const rtsIndex = require('./routes/index.router');
const userRoutes = require('./routes/user.router');

var app = express();

// middleware
app.use(bodyparser.json());

app.use(cors({
    origin: [
        "http://127.0.0.1:4200", "http://localhost:4200"
    ],
    credentials: true
}));
app.use(session({
    name: "hunarSession",
    secret: "widn#4sd2@2sl",
    resave: false,
    saveUninitialized: false,
    secure: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
})

// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
});

app.use('/api/address', addressRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/advertisements', advertisementRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api', rtsIndex);

app.listen(process.env.PORT, () => console.log('Server started at port :' + process.env.PORT));