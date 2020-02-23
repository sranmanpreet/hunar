const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const multer = require('multer');
const upload = multer({ dest: "uploads/" });

const jwtHelper = require('../config/jwtHelper');
const ctrlGallery = require('../controllers/product.controller');
const ctrlShoppingCart = require('../controllers/cart.controller');
const ctrlOrder = require('../controllers/order.controller');
const ctrlAdvertisement = require('../controllers/advertisement.controller');
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
router.put('/product/:id', ctrlGallery.updateProduct);

// add pricing to product
router.put('/product/:productId/pricing/add', ctrlGallery.addPricingToProduct);

// update pricing on product
router.put('/product/:productId/pricing/update', ctrlGallery.updatePricingOnProduct);

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