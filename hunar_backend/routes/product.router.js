const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: "uploads/" });

const jwtHelper = require('../config/jwtHelper');
const ctrlProduct = require('../controllers/product.controller');

// retrieving products
router.get('/', ctrlProduct.getProducts);

// retrieving product
router.get('/:itemId', ctrlProduct.getProduct);

// add product
router.post('/add', upload.single('productImage'), ctrlProduct.addProduct);

//deleting product
router.delete('/:id', ctrlProduct.deleteProduct);

//add pricing to product
router.post('/pricing/add/:productid', ctrlProduct.addPricingToProduct);

module.exports = router;