const express = require('express');
const router = express.Router();
const csrf = require('csurf');

const csrfProtection = csrf();

const ctrlAddress = require('../controllers/address.controller');

//router.use(csrfProtection);

//adding address
router.post('/add', ctrlAddress.addAddress);

router.get('/get', ctrlAddress.getAddress);

//deleting address
router.delete('/delete/:id', ctrlAddress.deleteAddress);

//address meta-data
router.get('/countries', ctrlAddress.getCountries);

router.get('/countries/:id', ctrlAddress.getCountry);

router.get('/countries/:countryId/states', ctrlAddress.getStates);

router.get('/countries/:countryId/states/:stateId', ctrlAddress.getState);

router.get('/countries/:countryId/states/:stateId/cities', ctrlAddress.getCities);

router.get('/countries/:countryId/states/:stateId/cities/:cityId', ctrlAddress.getCity);

module.exports = router;