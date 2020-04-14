const express = require('express');
const passport = require('passport');
const router = express.Router();

const authorize = require('../config/authorize');
const ctrlUser = require('../controllers/user.controller');

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/redirect', ctrlUser.googleLoginRedirect);

router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email']
}));

router.get('/auth/facebook/redirect', ctrlUser.facebookLoginRedirect);

router.post('/register', ctrlUser.register);

router.post('/login', ctrlUser.login);

router.post('/forgot-password', ctrlUser.forgotPasswordSendEmail);

router.post('/reset-password/:token', ctrlUser.resetPassword);

router.get('/profile', authorize.authorize(), ctrlUser.userProfile);

router.post('/updateProfile', authorize.authorize(), ctrlUser.updateUserDetails);

router.post('/updatePassword', authorize.authorize(), ctrlUser.updatePassword);

router.get('/logout', ctrlUser.logout);

module.exports = router;