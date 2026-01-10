const express = require('express');
const router = express.Router();
import {AuthController} from './auth.controller';
//import {authMiddleware} from './auth.middleware';

const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);

// protected routes
//router.get('/me', authMiddleware, authController.me);

export default router;