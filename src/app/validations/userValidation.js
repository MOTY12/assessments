import { param, body, query } from 'express-validator';

export const userValidation = {
  updateUser: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('User ID must be a positive integer'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('First name must be at least 2 characters long'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Last name must be at least 2 characters long'),
  ],

  getAllUsers: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('search')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Search term must not be empty'),
  ],
};
