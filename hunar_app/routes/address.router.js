const express = require('express');
const router = express.Router();

const authorize = require('../config/authorize');
const ctrlAddress = require('../controllers/address.controller');

//router.use(csrfProtection);

//adding address
router.post('/add', authorize.authorize(), ctrlAddress.addAddress);

router.get('/get', authorize.authorize(), ctrlAddress.getAddress);

//deleting address
router.delete('/delete/:id', authorize.authorize(), ctrlAddress.deleteAddress);

//address meta-data
router.get('/countries', authorize.authorize(), ctrlAddress.getCountries);

router.get('/countries/:id', authorize.authorize(), ctrlAddress.getCountry);

router.get('/countries/:countryId/states', authorize.authorize(), ctrlAddress.getStates);

router.get('/countries/:countryId/states/:stateId', authorize.authorize(), ctrlAddress.getState);

router.get('/countries/:countryId/states/:stateId/cities', authorize.authorize(), ctrlAddress.getCities);

router.get('/countries/:countryId/states/:stateId/cities/:cityId', authorize.authorize(), ctrlAddress.getCity);

module.exports = router;