import { genericErrors, Helper } from '../utils/index.js';
import User from '../models/User.js';

class UserService {
  /**
   * Create a new user
   */
  static async createUser(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw genericErrors.conflict('User with this email already exists');
      }

      // Create new user
      const user = new User(userData);
      await user.save();
      
      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw genericErrors.conflict('User with this email already exists');
      }
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        throw genericErrors.validationError(validationErrors.join(', '));
      }
      throw error;
    }
  }

  /**
   * Get all users with pagination
   */
  static async getAllUsers(page = 1, limit = 10, search = '') {
    try {
      const filter = {};
      
      // Apply search filter
      if (search) {
        filter.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
      };

      const result = await User.paginate(filter, options);
      
      return {
        users: result.docs,
        pagination: Helper.paginationData(page, limit, result.total),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get current user profile by ID
   */
  static async getCurrentUserProfile(id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        throw genericErrors.notFound('User profile');
      }
      
      return user;
    } catch (error) {
      if (error.name === 'CastError') {
        throw genericErrors.badRequest('Invalid user ID');
      }
      throw error;
    }
  }

  /**
   * Get user by email (including password for authentication)
   */
  static async getUserByEmail(email) {
    try {
      return await User.findByEmail(email);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user
   */
  static async updateUser(id, updateData) {
    try {
      // Remove password from update data if present (use separate method for password updates)
      const { password, ...safeUpdateData } = updateData;
      
      const user = await User.findByIdAndUpdate(
        id,
        safeUpdateData,
        { 
          new: true, 
          runValidators: true 
        }
      );
      
      if (!user) {
        throw genericErrors.notFound('User');
      }
      
      return user;
    } catch (error) {
      if (error.name === 'CastError') {
        throw genericErrors.badRequest('Invalid user ID');
      }
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        throw genericErrors.validationError(validationErrors.join(', '));
      }
      if (error.code === 11000) {
        throw genericErrors.conflict('Email already exists');
      }
      throw error;
    }
  }

  /**
   * Update user password
   */
  static async updatePassword(id, currentPassword, newPassword) {
    try {
      const user = await User.findById(id).select('+password');
      if (!user) {
        throw genericErrors.notFound('User');
      }

      // Verify current password
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        throw genericErrors.badRequest('Current password is incorrect');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      return true;
    } catch (error) {
      if (error.name === 'CastError') {
        throw genericErrors.badRequest('Invalid user ID');
      }
      throw error;
    }
  }

  /**
   * Verify user password
   */
  static async verifyPassword(email, password) {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        return false;
      }

      return await user.comparePassword(password);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user's last login
   */
  static async updateLastLogin(id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        throw genericErrors.notFound('User');
      }

      await user.updateLastLogin();
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(role, page = 1, limit = 10) {
    try {
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
      };

      const result = await User.paginate({ role, isActive: true }, options);
      
      return {
        users: result.docs,
        pagination: Helper.paginationData(page, limit, result.total),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Activate/Deactivate user
   */
  static async toggleUserStatus(id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        throw genericErrors.notFound('User');
      }

      user.isActive = !user.isActive;
      await user.save();

      return user;
    } catch (error) {
      if (error.name === 'CastError') {
        throw genericErrors.badRequest('Invalid user ID');
      }
      throw error;
    }
  }
}

export default UserService;
