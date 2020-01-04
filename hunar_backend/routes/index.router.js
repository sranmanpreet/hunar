const express = require('express');
const router = express.Router();
const csrf = require('csurf');

const jwtHelper = require('../config/jwtHelper');

const ctrlSupport = require('../controllers/support.controller');
const ctrlFeedback = require('../controllers/feedback.controller');

const csrfProtection = csrf();

//router.use(csrfProtection);

//create support request
router.post('/support/create', ctrlSupport.createSupportRequest);

//get support requests
router.get('/support/requests', jwtHelper.verifyJwtToken, ctrlSupport.getSupportRequests);

//create feedback
router.post('/feedback/create', ctrlFeedback.createFeedback);

//get feedbacks
router.get('/feedbacks', jwtHelper.verifyJwtToken, ctrlFeedback.getFeedbacks);

module.exports = router;