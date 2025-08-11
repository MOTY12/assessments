import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { genericErrors } from '../utils/index.js';
import UserService from './UserService.js';
import WalletService from './WalletService.js';

class AuthService {
  /**
   * Register a new user
   */
  static async register(userData) {
    const { email, password, firstName, lastName } = userData;
    
    // Check if user already exists
    const existingUser = await UserService.getUserByEmail(email);
    if (existingUser) {
      throw genericErrors.alreadyExists('User');
    }
    
    // Create user (password will be hashed automatically by the model)
    const newUser = await UserService.createUser({
      email,
      password,
      firstName,
      lastName,
    });
    
    // Auto-create wallet for new user
    const walletService = new WalletService();
    await walletService.autoCreateWallet(newUser._id);
    
    return {
      user: newUser
    };
  }

  /**
   * Login user
   */
  static async login(email, password) {
    // Find user by email
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      throw genericErrors.unauthorized;
    }
    
    // Verify password using the model's comparePassword method
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw genericErrors.unauthorized;
    }

    // Update last login
    await UserService.updateLastLogin(user._id);
    
    // Auto-create wallet if not exists
    const walletService = new WalletService();
    await walletService.autoCreateWallet(user._id);
    
    // Generate tokens
    const tokens = this.generateTokens(user);
    
    return {
      user: user, // User model already excludes password in toJSON
      ...tokens,
    };
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const user = await UserService.getCurrentUserProfile(decoded.userId);
      
      if (!user) {
        throw genericErrors.unauthorized;
      }
      
      const tokens = this.generateTokens(user);
      
      return tokens;
    } catch (error) {
      throw genericErrors.unauthorized;
    }
  }

  /**
   * Generate JWT tokens
   */
  static generateTokens(user) {
    const payload = {
      userId: user.id,
      email: user.email,
    };
    
    const accessToken = jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );
    
    const refreshToken = jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw genericErrors.unauthorized;
    }
  }
}

export default AuthService;
