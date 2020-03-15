const express = require('express');
const router = express.Router();

const jwtHelper = require('../config/jwtHelper');

const ctrlOrder = require('../controllers/order.controller');

//create order
router.post('/create', ctrlOrder.createOrder);

//get orders
router.get('/', jwtHelper.verifyJwtToken, ctrlOrder.getOrders);

//get order
router.post('/', jwtHelper.verifyJwtToken, ctrlOrder.getOrder);

//cancel order
router.post('/cancel', jwtHelper.verifyJwtToken, ctrlOrder.cancelOrder);

module.exports = router;