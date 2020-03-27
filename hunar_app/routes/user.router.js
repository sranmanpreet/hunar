const express = require('express');
const router = express.Router();
const authorize = require('../config/authorize');
const csrf = require('csurf');

const csrfProtection = csrf();

//router.use(csrfProtection);

const ctrlUser = require('../controllers/user.controller');

router.post('/register', ctrlUser.register);

router.post('/login', ctrlUser.login);

router.post('/forgot-password', ctrlUser.forgotPasswordSendEmail);

router.post('/reset-password/:token', ctrlUser.resetPassword);

router.get('/profile', authorize.authorize(), ctrlUser.userProfile);

router.post('/updateProfile', authorize.authorize(), ctrlUser.updateUserDetails);

router.post('/updatePassword', authorize.authorize(), ctrlUser.updatePassword);

router.get('/logout', ctrlUser.logout);

module.exports = router;