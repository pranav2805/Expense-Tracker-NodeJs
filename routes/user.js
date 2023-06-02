const express = require('express');

const userController = require('../controllers/userCont');

const router = express.Router();

router.post('/signup', userController.postUser);

router.post('/login', userController.login)

module.exports = router;
