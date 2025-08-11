import express from 'express';
import AuthController from '../controllers/AuthController.js';
import { authValidation } from '../validations/authValidation.js';
import { validateRequest } from '../middlewares/validation.js';

const router = express.Router();

// Register route
router.post('/register', 
  authValidation.register, 
  validateRequest, 
  AuthController.register
);

// Login route
router.post('/login', 
  authValidation.login, 
  validateRequest, 
  AuthController.login
);

// Refresh token route
router.post('/refresh-token', 
  authValidation.refreshToken, 
  validateRequest, 
  AuthController.refreshToken
);

// Logout route
router.post('/logout', AuthController.logout);

export default router;
