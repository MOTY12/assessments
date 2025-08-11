import { Helper } from '../utils/index.js';
import MessageService from '../services/MessageService.js';

class MessageController {
  /**
   * Get chat history with a specific user
   */
  static async getChatHistory(req, res, next) {
    try {
      const userId = req.user.userId;
      const { otherUserId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      
      const result = await MessageService.getChatHistory(userId, otherUserId, page, limit);
      
      return Helper.successResponse(
        req,
        res,
        result,
        200,
        'Chat history retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Send a message (REST endpoint as backup to Socket.IO)
   */
  static async sendMessage(req, res, next) {
    try {
      const userId = req.user.userId;
      const { receiverId, content, type = 'text', replyTo = null } = req.body;
      
      const message = await MessageService.sendMessage(userId, receiverId, content, type, replyTo);
      
      return Helper.successResponse(
        req,
        res,
        message,
        201,
        'Message sent successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark messages as read
   */
  static async markMessagesAsRead(req, res, next) {
    try {
      const userId = req.user.userId;
      const { senderId } = req.body;
      
      await MessageService.markMessagesAsRead(senderId, userId);
      
      return Helper.successResponse(
        req,
        res,
        null,
        200,
        'Messages marked as read'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get unread message count
   */
  static async getUnreadCount(req, res, next) {
    try {
      const userId = req.user.userId;
      
      const result = await MessageService.getUnreadCount(userId);
      
      return Helper.successResponse(
        req,
        res,
        result,
        200,
        'Unread count retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Edit a message
   */
  static async editMessage(req, res, next) {
    try {
      const userId = req.user.userId;
      const { messageId } = req.params;
      const { content } = req.body;
      
      const message = await MessageService.editMessage(messageId, userId, content);
      
      return Helper.successResponse(
        req,
        res,
        message,
        200,
        'Message edited successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a message
   */
  static async deleteMessage(req, res, next) {
    try {
      const userId = req.user.userId;
      const { messageId } = req.params;
      
      await MessageService.deleteMessage(messageId, userId);
      
      return Helper.successResponse(
        req,
        res,
        null,
        200,
        'Message deleted successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get recent conversations
   */
  static async getRecentConversations(req, res, next) {
    try {
      const userId = req.user.userId;
      const { limit = 10 } = req.query;
      
      const conversations = await MessageService.getRecentConversations(userId, limit);
      
      return Helper.successResponse(
        req,
        res,
        { conversations },
        200,
        'Recent conversations retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}

export default MessageController;
