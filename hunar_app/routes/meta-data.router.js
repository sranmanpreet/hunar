const express = require('express');
const router = express.Router();

const ROLE = require('../config/role')
const authorize = require('../config/authorize');

//router.use(csrfProtection);

const ctrlArtType = require('../controllers/art-type.controller');
const ctrlArtSize = require('../controllers/art-size.controller');
const ctrlPriceList = require('../controllers/pricing.controller');

router.get('/arttypes', ctrlArtType.getArtTypes);

router.get('/artsizes', ctrlArtSize.getArtSizes);

router.get('/pricelist', ctrlPriceList.getPriceList);

router.use(authorize.authorize(ROLE.Admin));

router.post('/arttype', ctrlArtType.createArtType);

router.delete('/arttype/:id', ctrlArtType.deleteArtType);

router.post('/artsize', ctrlArtSize.createArtSize);

router.delete('/artsize/:id', ctrlArtSize.deleteArtSize);

router.post('/pricelist', ctrlPriceList.addPrice);

router.delete('/pricelist/:id', ctrlPriceList.deletePrice);

module.exports = router;