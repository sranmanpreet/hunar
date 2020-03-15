const express = require('express');
const path = require('path');
const router = express.Router();
const csrf = require('csurf');
const dateFormat = require('dateformat');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./public/frontend/src/assets/products/");
    },
    filename: function(req, file, cb) {
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

const jwtHelper = require('../config/jwtHelper');

const ctrlSupport = require('../controllers/support.controller');
const ctrlFeedback = require('../controllers/feedback.controller');

const csrfProtection = csrf();

//router.use(csrfProtection);

// retrieving products
router.get('/products', ctrlGallery.getProducts);

// retrieving all products
router.get('/all-products', ctrlGallery.getAllProducts);

// retrieving product
router.get('/product/:itemId', ctrlGallery.getProduct);

// add product
router.post('/product/add', upload.single('productImage'), ctrlGallery.addProduct);

// update product
router.put('/product/:id', upload.single('productImage'), ctrlGallery.updateProduct);

// add pricing to product
router.put('/product/:productId/pricing/add', ctrlGallery.addPricingToProduct);

// update pricing on product
router.put('/product/:productId/pricing/update/:id', ctrlGallery.updatePricingOnProduct);

// delete pricing on product
router.delete('/product/:productId/pricing/:id', ctrlGallery.deletePricing);

//deleting product
router.delete('/product/:id', ctrlGallery.deleteProduct);

router.get('/cart', ctrlShoppingCart.getShoppingCartItems);

//add shopping cart item 
router.post('/add-to-cart', ctrlShoppingCart.addShoppingCartItem);

//deleting shopping cart item
router.delete('/cart/cart-item/:id', ctrlShoppingCart.deleteShoppingCartItem);

//updating cart item quantity
router.post('/update-cart', ctrlShoppingCart.updateCart);

//create order
router.post('/order/create', ctrlOrder.createOrder);

//get orders
router.get('/orders', jwtHelper.verifyJwtToken, ctrlOrder.getOrders);

//get order
router.post('/order', jwtHelper.verifyJwtToken, ctrlOrder.getOrder);

//cancel order
router.post('/order/cancel', jwtHelper.verifyJwtToken, ctrlOrder.cancelOrder);

//create advertisement lead
router.post('/order/advertise', ctrlAdvertisement.createAdvertisementLead);

//get advertisement leads
router.get('/order/advertisements', jwtHelper.verifyJwtToken, ctrlAdvertisement.getAdvertisementLeads);

//create support request
router.post('/support/create', ctrlSupport.createSupportRequest);

//get support requests
router.get('/support/requests', jwtHelper.verifyJwtToken, ctrlSupport.getSupportRequests);

//create feedback
router.post('/feedback/create', ctrlFeedback.createFeedback);

//get feedbacks
router.get('/feedbacks', jwtHelper.verifyJwtToken, ctrlFeedback.getFeedbacks);

module.exports = router;