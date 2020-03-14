const express = require('express');
const router = express.Router();
const csrf = require('csurf');

const csrfProtection = csrf();

//router.use(csrfProtection);

const ctrlArtType = require('../controllers/art-type.controller');
const ctrlArtSize = require('../controllers/art-size.controller');

router.post('/arttype', ctrlArtType.createArtType);

router.get('/arttypes', ctrlArtType.getArtTypes);

router.delete('/arttype/:arttype', ctrlArtType.deleteArtType);

router.post('/artsize', ctrlArtSize.createArtSize);

router.get('/artsizes', ctrlArtSize.getArtSizes);

router.delete('/arttype/:artsize', ctrlArtSize.deleteArtSize);

module.exports = router;