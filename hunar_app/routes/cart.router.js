const express = require('express');
const router = express.Router();

const ctrlShoppingCart = require('../controllers/cart.controller');

router.get('/', ctrlShoppingCart.getShoppingCartItems);

//add shopping cart item 
router.post('/add', ctrlShoppingCart.addShoppingCartItem);

//deleting shopping cart item
router.delete('/cart-item/:id', ctrlShoppingCart.deleteShoppingCartItem);

//updating cart item quantity
router.post('/update', ctrlShoppingCart.updateCart);

module.exports = router;