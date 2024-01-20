const express = require('express');

const AuthController = require('../../services/auth');
const router = express.Router;
const jsonParser = express.json;


router.post('/register', jsonParser, AuthController.register);
router.post('/login', jsonParser, AuthController.login);

module.exports = router;