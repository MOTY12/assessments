import { Helper } from '../utils/index.js';
import UserService from '../services/UserService.js';

class UserController {
  /**
   * Get all users
   */
  static async getAllUsers(req, res, next) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const result = await UserService.getAllUsers(page, limit, search);
      
      return Helper.successResponse(
        req, 
        res, 
        result, 
        200, 
        'Users retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user
   */
  static async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const user = await UserService.updateUser(id, updateData);
      
      return Helper.successResponse(
        req, 
        res, 
        user, 
        200, 
        'User updated successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(req, res, next) {
    try {
      const userId = req.user.userId;
      const user = await UserService.getCurrentUserProfile(userId);
      
      return Helper.successResponse(
        req, 
        res, 
        user, 
        200, 
        'Profile retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
