import { Helper } from '../utils/index.js';
import UserService from '../services/UserService.js';

class UserController {

  /**
   * Update user
   */
  static async updateUser(req, res, next) {
    try {
      const { id } = req.body;
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
