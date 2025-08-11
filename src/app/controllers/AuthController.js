import { Helper } from '../utils/index.js';
import AuthService from '../services/AuthService.js';

class AuthController {
  /**
   * Register a new user
   */
  static async register(req, res, next) {
    try {
      const userData = req.body;
      const result = await AuthService.register(userData);
      
      return Helper.successResponse(
        req, 
        res, 
        result, 
        201, 
        'User registered successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      
      return Helper.successResponse(
        req, 
        res, 
        result, 
        200, 
        'Login successful'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshToken(refreshToken);
      
      return Helper.successResponse(
        req, 
        res, 
        result, 
        200, 
        'Token refreshed successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   */
  static async logout(req, res, next) {
    try {
      // In a real application, you might want to blacklist the token
      return Helper.successResponse(
        req, 
        res, 
        null, 
        200, 
        'Logout successful'
      );
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
