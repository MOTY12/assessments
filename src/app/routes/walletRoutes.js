import express from 'express';
import WalletController from '../controllers/WalletController.js';
import { walletValidation } from '../validations/walletValidation.js';
import { validateRequest } from '../middlewares/validation.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route   POST /api/v1/wallet/create
 * @desc    Create a new wallet for user (OnePipe integration)
 * @access  Private
 */
router.post('/create', 
  authenticate, 
  walletValidation.createWallet, 
  validateRequest, 
  WalletController.createWallet
);

/**
 * @route   GET /api/v1/wallet/balance
 * @desc    Get wallet balance
 * @access  Private
 */
router.get('/balance', 
  authenticate, 
  WalletController.getWalletBalance
);

/**
 * @route   GET /api/v1/wallet/details
 * @desc    Get wallet details
 * @access  Private
 */
router.get('/details', 
  authenticate, 
  WalletController.getWalletDetails
);

/**
 * @route   POST /api/v1/wallet/fund
 * @desc    Fund wallet
 * @access  Private
 */
router.post('/fund', 
  authenticate, 
  walletValidation.fundWallet, 
  validateRequest, 
  WalletController.fundWallet
);

/**
 * @route   POST /api/v1/wallet/transfer
 * @desc    Transfer funds from wallet
 * @access  Private
 */
router.post('/transfer', 
  authenticate, 
  walletValidation.transferFunds, 
  validateRequest, 
  WalletController.transferFunds
);

/**
 * @route   GET /api/v1/wallet/transactions
 * @desc    Get wallet transaction history
 * @access  Private
 */
router.get('/transactions', 
  authenticate, 
  walletValidation.getTransactionHistory, 
  validateRequest, 
  WalletController.getTransactionHistory
);

export default router;
