import axios from 'axios';
import { logger } from '../utils/index.js';

/**
 * OnePipe Service - MOCKED VERSION
 * This service simulates OnePipe API calls for development and testing
 * Replace with actual OnePipe API calls for production
 */
class OnePipeService {
  constructor() {
    this.baseURL = process.env.ONEPIPE_BASE_URL || 'https://api.onepipe.io/v1';
    this.apiKey = process.env.ONEPIPE_API_KEY;
    this.secretKey = process.env.ONEPIPE_SECRET_KEY;
    this.bankCode = process.env.ONEPIPE_BANK_CODE || 'ONEPIPE';
  }

  /**
   * Get OnePipe headers
   */
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'X-Secret-Key': this.secretKey,
    };
  }

  /**
   * Create customer on OnePipe (MOCKED)
   */
  async createCustomer(userData) {
    try {
      // Mock OnePipe customer creation response
      const mockResponse = {
        success: true,
        customerId: `OPP_CUST_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber || '',
        status: 'active',
        createdAt: new Date().toISOString(),
        metadata: {
          userId: userData.userId,
        },
      };

      logger.info('OnePipe customer created (MOCK):', mockResponse);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockResponse;
    } catch (error) {
      logger.error('OnePipe create customer error (MOCK):', error.message);
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  }

  /**
   * Create wallet account on OnePipe (MOCKED)
   */
  async createWalletAccount(customerId, accountData) {
    try {
      // Generate mock account number
      const accountNumber = `${Math.floor(Math.random() * 9000000000) + 1000000000}`;
      
      // Mock OnePipe wallet account creation response
      const mockResponse = {
        success: true,
        accountId: `OPP_ACC_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        accountNumber: accountNumber,
        accountName: accountData.accountName,
        customerId: customerId,
        currency: accountData.currency || 'NGN',
        accountType: 'wallet',
        balance: 0,
        status: 'active',
        bankCode: 'ONEPIPE',
        createdAt: new Date().toISOString(),
        metadata: {
          userId: accountData.userId,
        },
      };

      logger.info('OnePipe wallet account created (MOCK):', mockResponse);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockResponse;
    } catch (error) {
      logger.error('OnePipe create account error (MOCK):', error.message);
      throw new Error(`Failed to create wallet account: ${error.message}`);
    }
  }

  /**
   * Get account balance (MOCKED)
   */
  async getAccountBalance(accountId) {
    try {
      // Mock balance response
      const mockResponse = {
        success: true,
        accountId: accountId,
        availableBalance: Math.floor(Math.random() * 10000), // Random balance for demo
        currency: 'NGN',
        lastUpdated: new Date().toISOString(),
      };

      logger.info('OnePipe balance retrieved (MOCK):', mockResponse);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return mockResponse;
    } catch (error) {
      logger.error('OnePipe get balance error (MOCK):', error.message);
      throw new Error(`Failed to get account balance: ${error.message}`);
    }
  }

  /**
   * Fund wallet account (MOCKED)
   */
  async fundAccount(accountId, amount, reference, description = 'Wallet funding') {
    try {
      // Mock funding response
      const mockResponse = {
        success: true,
        transactionId: `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        reference: reference,
        accountId: accountId,
        amount: amount,
        description: description,
        currency: 'NGN',
        status: 'completed',
        timestamp: new Date().toISOString(),
      };

      logger.info('OnePipe account funded (MOCK):', mockResponse);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return mockResponse;
    } catch (error) {
      logger.error('OnePipe fund account error (MOCK):', error.message);
      throw new Error(`Failed to fund account: ${error.message}`);
    }
  }

  /**
   * Debit wallet account (MOCKED)
   */
  async debitAccount(accountId, amount, reference, description = 'Wallet debit') {
    try {
      // Mock debit response
      const mockResponse = {
        success: true,
        transactionId: `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        reference: reference,
        accountId: accountId,
        amount: amount,
        description: description,
        currency: 'NGN',
        status: 'completed',
        timestamp: new Date().toISOString(),
      };

      logger.info('OnePipe account debited (MOCK):', mockResponse);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return mockResponse;
    } catch (error) {
      logger.error('OnePipe debit account error (MOCK):', error.message);
      throw new Error(`Failed to debit account: ${error.message}`);
    }
  }

  /**
   * Transfer funds between accounts (MOCKED)
   */
  async transferFunds(fromAccountId, toAccountId, amount, reference, description = 'Wallet transfer') {
    try {
      // Mock transfer response
      const mockResponse = {
        success: true,
        transactionId: `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        reference: reference,
        fromAccountId: fromAccountId,
        toAccountId: toAccountId,
        amount: amount,
        description: description,
        currency: 'NGN',
        status: 'completed',
        timestamp: new Date().toISOString(),
      };

      logger.info('OnePipe transfer completed (MOCK):', mockResponse);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockResponse;
    } catch (error) {
      logger.error('OnePipe transfer error (MOCK):', error.message);
      throw new Error(`Failed to transfer funds: ${error.message}`);
    }
  }

  /**
   * Get transaction status (MOCKED)
   */
  async getTransactionStatus(reference) {
    try {
      // Mock transaction status response
      const mockResponse = {
        success: true,
        reference: reference,
        status: 'completed',
        amount: Math.floor(Math.random() * 10000),
        currency: 'NGN',
        timestamp: new Date().toISOString(),
        description: 'Mock transaction',
      };

      logger.info('OnePipe transaction status retrieved (MOCK):', mockResponse);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return mockResponse;
    } catch (error) {
      logger.error('OnePipe get transaction status error (MOCK):', error.message);
      throw new Error(`Failed to get transaction status: ${error.message}`);
    }
  }

  /**
   * Generate transaction reference
   */
  generateReference(prefix = 'TXN') {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `${prefix}_${timestamp}_${random}`;
  }
}

export default OnePipeService;
