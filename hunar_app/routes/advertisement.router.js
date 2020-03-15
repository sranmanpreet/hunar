const express = require('express');
const router = express.Router();
const csrf = require('csurf');

const jwtHelper = require('../config/jwtHelper');

const ctrlAdvertisement = require('../controllers/advertisement.controller');

//create advertisement lead
router.post('/create', ctrlAdvertisement.createAdvertisementLead);

//get advertisement leads
router.get('/', jwtHelper.verifyJwtToken, ctrlAdvertisement.getAdvertisementLeads);

module.exports = router;