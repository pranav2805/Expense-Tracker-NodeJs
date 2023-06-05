const express = require('express');

const userController = require('../controllers/userCont');
const resetPasswordController = require('../controllers/resetPassword');

const router = express.Router();

router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.post('/password/forgotPassword', resetPasswordController.postEmail);

module.exports = router;
