import express from 'express';
import UserController from '../controllers/UserController.js';
import { userValidation } from '../validations/userValidation.js';
import { validateRequest } from '../middlewares/validation.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();


// Update user (protected route)
router.put('/profile', 
  authenticate, 
  userValidation.updateUser, 
  validateRequest, 
  UserController.updateUser
);

// Get current user profile (protected route)
router.get('/profile', 
  authenticate, 
  UserController.getCurrentUser
);

export default router;
