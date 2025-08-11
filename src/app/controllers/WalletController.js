import { Helper } from '../utils/index.js';
import WalletService from '../services/WalletService.js';

class WalletController {
  /**
   * Create wallet for user
   */
  static async createWallet(req, res, next) {
    try {
      const userId = req.user.userId;
      const { currency } = req.body;
      
      const walletService = new WalletService();
      const wallet = await walletService.createWallet(userId, currency);
      
      return Helper.successResponse(
        req,
        res,
        wallet,
        201,
        'Wallet created successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get wallet balance
   */
  static async getWalletBalance(req, res, next) {
    try {
      const userId = req.user.userId;
      
      const walletService = new WalletService();
      const balance = await walletService.getWalletBalance(userId);
      
      return Helper.successResponse(
        req,
        res,
        balance,
        200,
        'Wallet balance retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get wallet details
   */
  static async getWalletDetails(req, res, next) {
    try {
      const userId = req.user.userId;
      
      const walletService = new WalletService();
      const wallet = await walletService.getWalletDetails(userId);
      
      return Helper.successResponse(
        req,
        res,
        wallet,
        200,
        'Wallet details retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fund wallet
   */
  static async fundWallet(req, res, next) {
    try {
      const userId = req.user.userId;
      const { amount, description } = req.body;
      
      const walletService = new WalletService();
      const result = await walletService.fundWallet(userId, amount, description);
      
      return Helper.successResponse(
        req,
        res,
        result,
        200,
        'Wallet funded successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Transfer funds
   */
  static async transferFunds(req, res, next) {
    try {
      const userId = req.user.userId;
      const { recipientAccountNumber, amount, description } = req.body;
      
      const walletService = new WalletService();
      const result = await walletService.transferFunds(
        userId,
        recipientAccountNumber,
        amount,
        description
      );
      
      return Helper.successResponse(
        req,
        res,
        result,
        200,
        'Funds transferred successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get transaction history
   */
  static async getTransactionHistory(req, res, next) {
    try {
      const userId = req.user.userId;
      const { page = 1, limit = 10 } = req.query;
      
      const walletService = new WalletService();
      const result = await walletService.getTransactionHistory(userId, page, limit);
      
      return Helper.successResponse(
        req,
        res,
        result,
        200,
        'Transaction history retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}

export default WalletController;
