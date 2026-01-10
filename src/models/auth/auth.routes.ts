const express = require('express');
const router = express.Router();

const authController = require('./auth.controller');
const authMiddleware = require('../../middilwares/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

// protected routes
router.get('/me', authMiddleware, authController.me);

module.exports = router;