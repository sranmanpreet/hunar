const express = require('express');
const router = express.Router();
const jwtHelper = require('../config/jwtHelper');
const csrf = require('csurf');

const csrfProtection = csrf();

//router.use(csrfProtection);

const ctrlUser = require('../controllers/user.controller');

router.post('/register', ctrlUser.register);

router.post('/login', ctrlUser.login);

router.post('/forgot-password', ctrlUser.forgotPasswordSendEmail);

router.post('/reset-password/:token', ctrlUser.resetPassword);

router.get('/profile', jwtHelper.verifyJwtToken, ctrlUser.userProfile);

router.post('/updateProfile', jwtHelper.verifyJwtToken, ctrlUser.updateUserDetails);

router.post('/updatePassword', ctrlUser.updatePassword);

router.get('/logout', ctrlUser.logout);

module.exports = router;
