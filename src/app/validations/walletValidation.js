import { body, query } from 'express-validator';

export const walletValidation = {
  createWallet: [
    body('currency')
      .optional()
      .isIn(['NGN', 'USD', 'GBP', 'EUR'])
      .withMessage('Currency must be one of: NGN, USD, GBP, EUR'),
  ],

  fundWallet: [
    body('amount')
      .isFloat({ min: 1 })
      .withMessage('Amount must be a positive number greater than 0'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Description must be between 1 and 255 characters'),
  ],

  transferFunds: [
    body('recipientAccountNumber')
      .notEmpty()
      .trim()
      .isLength({ min: 10, max: 20 })
      .withMessage('Recipient account number must be between 10 and 20 characters'),
    body('amount')
      .isFloat({ min: 1 })
      .withMessage('Amount must be a positive number greater than 0'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Description must be between 1 and 255 characters'),
  ],

  getTransactionHistory: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],
};
