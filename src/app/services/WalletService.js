import { genericErrors, Helper } from '../utils/index.js';
import Wallet from '../models/Wallet.js';
import OnePipeService from './OnePipeService.js';
import UserService from './UserService.js';

class WalletService {
  constructor() {
    this.onePipeService = new OnePipeService();
  }

  /**
   * Create a new wallet for user
   */
  async createWallet(userId, currency = 'NGN') {
    try {
      // Check if user already has a wallet
      const existingWallet = await Wallet.findByUserId(userId);
      if (existingWallet) {
        throw genericErrors.conflict('User already has a wallet');
      }

      // Get user details
      const user = await UserService.getCurrentUserProfile(userId);
      if (!user) {
        throw genericErrors.notFound('User not found');
      }

      // Create customer on OnePipe
      const onePipeCustomer = await this.onePipeService.createCustomer({
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
      });

      // Create wallet account on OnePipe
      const accountName = `${user.firstName} ${user.lastName}`;
      const onePipeAccount = await this.onePipeService.createWalletAccount(
        onePipeCustomer.customerId,
        {
          userId: user._id,
          accountName,
          currency,
        }
      );

      // Create wallet in database
      const wallet = new Wallet({
        userId: user._id,
        accountNumber: onePipeAccount.accountNumber,
        accountName,
        currency,
        onePipeAccountId: onePipeAccount.accountId,
        onePipeCustomerId: onePipeCustomer.customerId,
        balance: 0,
        status: 'active',
      });

      await wallet.save();

      return wallet;
    } catch (error) {
      if (error.code === 11000) {
        throw genericErrors.conflict('Wallet already exists for this user');
      }
      throw error;
    }
  }

  /**
   * Get wallet by user ID
   */
  async getWalletByUserId(userId) {
    try {
      const wallet = await Wallet.findByUserId(userId);
      if (!wallet) {
        throw genericErrors.notFound('Wallet not found');
      }
      return wallet;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get wallet balance
   */
  async getWalletBalance(userId) {
    try {
      const wallet = await this.getWalletByUserId(userId);
      
      // Sync balance with OnePipe
      const onePipeBalance = await this.onePipeService.getAccountBalance(wallet.onePipeAccountId);
      
      // Update local balance if different
      if (wallet.balance !== onePipeBalance.availableBalance) {
        wallet.balance = onePipeBalance.availableBalance;
        await wallet.save();
      }

      return {
        balance: wallet.balance,
        currency: wallet.currency,
        formattedBalance: wallet.formattedBalance,
        accountNumber: wallet.accountNumber,
        accountName: wallet.accountName,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fund wallet
   */
  async fundWallet(userId, amount, description = 'Wallet funding') {
    try {
      const wallet = await this.getWalletByUserId(userId);
      
      if (!wallet.canTransact(0)) {
        throw genericErrors.badRequest('Wallet is not active for transactions');
      }

      const reference = this.onePipeService.generateReference('FUND');
      
      // Fund account on OnePipe
      const onePipeTransaction = await this.onePipeService.fundAccount(
        wallet.onePipeAccountId,
        amount,
        reference,
        description
      );

      // Update wallet balance
      const oldBalance = wallet.balance;
      await wallet.updateBalance(amount, 'credit');

      // Add transaction record
      const transaction = {
        type: 'credit',
        amount,
        description,
        reference,
        status: 'completed',
        balanceAfter: wallet.balance,
        onePipeReference: onePipeTransaction.reference,
        metadata: {
          onePipeTransactionId: onePipeTransaction.transactionId,
        },
      };

      await wallet.addTransaction(transaction);

      return {
        wallet,
        transaction,
        previousBalance: oldBalance,
        newBalance: wallet.balance,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Transfer funds from wallet
   */
  async transferFunds(userId, recipientAccountNumber, amount, description = 'Wallet transfer') {
    try {
      const wallet = await this.getWalletByUserId(userId);
      
      if (!wallet.canTransact(amount)) {
        throw genericErrors.badRequest('Insufficient balance or wallet not active');
      }

      // Find recipient wallet
      const recipientWallet = await Wallet.findByAccountNumber(recipientAccountNumber);
      if (!recipientWallet) {
        throw genericErrors.notFound('Recipient wallet not found');
      }

      const reference = this.onePipeService.generateReference('TRANSFER');
      
      // Transfer funds on OnePipe
      const onePipeTransaction = await this.onePipeService.transferFunds(
        wallet.onePipeAccountId,
        recipientWallet.onePipeAccountId,
        amount,
        reference,
        description
      );

      // Update sender wallet balance
      const senderOldBalance = wallet.balance;
      await wallet.updateBalance(amount, 'debit');

      // Update recipient wallet balance
      const recipientOldBalance = recipientWallet.balance;
      await recipientWallet.updateBalance(amount, 'credit');

      // Add transaction record to sender
      const senderTransaction = {
        type: 'debit',
        amount,
        description: `Transfer to ${recipientWallet.accountName}`,
        reference,
        status: 'completed',
        balanceAfter: wallet.balance,
        onePipeReference: onePipeTransaction.reference,
        metadata: {
          recipientAccountNumber,
          recipientName: recipientWallet.accountName,
          onePipeTransactionId: onePipeTransaction.transactionId,
        },
      };

      // Add transaction record to recipient
      const recipientTransaction = {
        type: 'credit',
        amount,
        description: `Transfer from ${wallet.accountName}`,
        reference,
        status: 'completed',
        balanceAfter: recipientWallet.balance,
        onePipeReference: onePipeTransaction.reference,
        metadata: {
          senderAccountNumber: wallet.accountNumber,
          senderName: wallet.accountName,
          onePipeTransactionId: onePipeTransaction.transactionId,
        },
      };

      await wallet.addTransaction(senderTransaction);
      await recipientWallet.addTransaction(recipientTransaction);

      return {
        senderWallet: wallet,
        recipientWallet,
        transaction: senderTransaction,
        senderPreviousBalance: senderOldBalance,
        senderNewBalance: wallet.balance,
        recipientPreviousBalance: recipientOldBalance,
        recipientNewBalance: recipientWallet.balance,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get wallet transaction history
   */
  async getTransactionHistory(userId, page = 1, limit = 10) {
    try {
      const wallet = await this.getWalletByUserId(userId);
      const transactions = wallet.getTransactionHistory(limit, page);
      
      return {
        transactions,
        pagination: Helper.paginationData(page, limit, wallet.transactions.length),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Auto-create wallet on signup or first login
   */
  async autoCreateWallet(userId) {
    try {
      // Check if user already has a wallet
      const existingWallet = await Wallet.findByUserId(userId);
      if (existingWallet) {
        return existingWallet;
      }

      // Auto-create wallet
      return await this.createWallet(userId);
    } catch (error) {
      // Log error but don't throw to prevent login/signup failure
      console.error('Auto wallet creation failed:', error);
      return null;
    }
  }

  /**
   * Get wallet details
   */
  async getWalletDetails(userId) {
    try {
      const wallet = await this.getWalletByUserId(userId);
      const balance = await this.getWalletBalance(userId);
      
      return {
        ...wallet.toJSON(),
        ...balance,
        transactionCount: wallet.transactions.length,
        lastTransactionDate: wallet.lastTransactionDate,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default WalletService;
