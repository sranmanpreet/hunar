const express = require('express');
const path = require('path');
const router = express.Router();
const dateFormat = require('dateformat');
const multer = require('multer');

const ROLE = require('../config/role')
const authorize = require('../config/authorize');
const ctrlGallery = require('../controllers/product.controller');
const ctrlShoppingCart = require('../controllers/cart.controller');
const ctrlOrder = require('../controllers/order.controller');
const ctrlAdvertisement = require('../controllers/advertisement.controller');
const ctrlSupport = require('../controllers/support.controller');
const ctrlFeedback = require('../controllers/feedback.controller');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if (req.body.productType == 'Make To Order') {
            cb(null, "./public/frontend/src/assets/make-to-order/");
        } else {
            cb(null, "./public/frontend/src/assets/products/");
        }
    },
    filename: function(req, file, cb) {
        if (req.body.productType == 'Make To Order') {
            req.body.name = 'Exclusive Art - ' + file.originalname;
            req.body.imgurl = "./public/frontend/src/assets/make-to-order/" + dateFormat(new Date(), "dd-mm-yyyy_HH-MM-ss_") + file.originalname;
        }
        cb(null, dateFormat(new Date(), "dd-mm-yyyy_HH-MM-ss_") + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function(req, file, cb) {

        // Set the filetypes, it is optional 
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = filetypes.test(path.extname(
            file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Error: File upload only supports the " +
            "following filetypes - " + filetypes);
    }
});

// retrieving products
router.get('/products', ctrlGallery.getProducts);

// retrieving all products
router.get('/all-products', authorize.authorize(ROLE.Admin), ctrlGallery.getAllProducts);

// retrieving product
router.get('/product/:itemId', ctrlGallery.getProduct);

// add product
router.post('/product/add', authorize.authorize(ROLE.Admin), upload.single('productImage'), ctrlGallery.addProduct);

// update product
router.put('/product/:id', authorize.authorize(ROLE.Admin), upload.single('productImage'), ctrlGallery.updateProduct);

// add pricing to product
router.put('/product/:productId/pricing/add', authorize.authorize(ROLE.Admin), ctrlGallery.addPricingToProduct);

// update pricing on product
router.put('/product/:productId/pricing/update/:id', authorize.authorize(ROLE.Admin), ctrlGallery.updatePricingOnProduct);

// delete pricing on product
router.delete('/product/:productId/pricing/:id', authorize.authorize(ROLE.Admin), ctrlGallery.deletePricing);

//deleting product
router.delete('/product/:id', authorize.authorize(ROLE.Admin), ctrlGallery.deleteProduct);

router.get('/cart', ctrlShoppingCart.getShoppingCartItems);

//add shopping cart item 
router.post('/add-to-cart', ctrlShoppingCart.addShoppingCartItem);

//add 'Make To Order' shopping cart item  
router.post('/make-to-order/add-to-cart', upload.single('productImage'), ctrlShoppingCart.addShoppingCartItem);

//deleting shopping cart item
router.delete('/cart/cart-item/:id', ctrlShoppingCart.deleteShoppingCartItem);

//updating cart item quantity
router.post('/update-cart', ctrlShoppingCart.updateCart);

//create order
router.post('/order/create', authorize.authorize(), ctrlOrder.createOrder);

//get orders
router.get('/orders', authorize.authorize(), ctrlOrder.getOrders);

//get order
router.post('/order', authorize.authorize(), ctrlOrder.getOrder);

//cancel order
router.post('/order/cancel', authorize.authorize(), ctrlOrder.cancelOrder);

//create advertisement lead
router.post('/order/advertise', ctrlAdvertisement.createAdvertisementLead);

//get advertisement leads
router.get('/order/advertisements', authorize.authorize(), ctrlAdvertisement.getAdvertisementLeads);

//create support request
router.post('/support/create', ctrlSupport.createSupportRequest);

//get support requests
router.get('/support/requests', authorize.authorize(), ctrlSupport.getSupportRequests);

//create feedback
router.post('/feedback/create', authorize.authorize(), ctrlFeedback.createFeedback);

//get feedbacks
router.get('/feedbacks', authorize.authorize(), ctrlFeedback.getFeedbacks);

module.exports = router;