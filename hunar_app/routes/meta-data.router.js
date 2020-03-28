const express = require('express');
const router = express.Router();

const ROLE = require('../config/role')
const authorize = require('../config/authorize');

//router.use(csrfProtection);

const ctrlArtType = require('../controllers/art-type.controller');
const ctrlArtSize = require('../controllers/art-size.controller');

router.use(authorize.authorize(ROLE.Admin));

router.post('/arttype', ctrlArtType.createArtType);

router.get('/arttypes', ctrlArtType.getArtTypes);

router.delete('/arttype/:id', ctrlArtType.deleteArtType);

router.post('/artsize', ctrlArtSize.createArtSize);

router.get('/artsizes', ctrlArtSize.getArtSizes);

router.delete('/artsize/:id', ctrlArtSize.deleteArtSize);

module.exports = router;