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


}

export default AuthController;
