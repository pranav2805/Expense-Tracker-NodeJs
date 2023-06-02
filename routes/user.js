const express = require('express');

const userController = require('../controllers/userCont');

const router = express.Router();

router.post('/signup', userController.postUser);

module.exports = router;
