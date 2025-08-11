import { genericErrors, Helper } from '../utils/index.js';
import Message from '../models/Message.js';
import UserService from './UserService.js';

class MessageService {
  /**
   * Send a message
   */
  static async sendMessage(senderId, receiverId, content, type = 'text', replyTo = null) {
    try {
      // Validate sender and receiver exist
      const sender = await UserService.getCurrentUserProfile(senderId);
      const receiver = await UserService.getCurrentUserProfile(receiverId);

      if (!sender) {
        throw genericErrors.notFound('Sender not found');
      }

      if (!receiver) {
        throw genericErrors.notFound('Receiver not found');
      }

      // Create message
      const message = new Message({
        senderId,
        receiverId,
        content,
        type,
        replyTo,
        status: 'sent',
      });

      await message.save();

      // Populate sender and receiver info
      await message.populate('senderId', 'firstName lastName email profileImage');
      await message.populate('receiverId', 'firstName lastName email profileImage');

      if (replyTo) {
        await message.populate('replyTo');
      }

      return message;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get chat history between two users
   */
  static async getChatHistory(userId1, userId2, page = 1, limit = 50) {
    try {
      // Validate users exist
      const user1 = await UserService.getCurrentUserProfile(userId1);
      const user2 = await UserService.getCurrentUserProfile(userId2);

      if (!user1 || !user2) {
        throw genericErrors.notFound('One or both users not found');
      }

      const messages = await Message.getChatHistory(userId1, userId2, { page, limit });

      return {
        messages: messages.reverse(), // Reverse to show oldest first
        pagination: Helper.paginationData(page, limit, messages.length),
        participants: {
          user1: user1,
          user2: user2,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark messages as read
   */
  static async markMessagesAsRead(senderId, receiverId) {
    try {
      const result = await Message.markAsRead(senderId, receiverId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get unread message count for user
   */
  static async getUnreadCount(userId) {
    try {
      const count = await Message.getUnreadCount(userId);
      return { unreadCount: count };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Edit a message
   */
  static async editMessage(messageId, userId, newContent) {
    try {
      const message = await Message.findById(messageId);

      if (!message) {
        throw genericErrors.notFound('Message not found');
      }

      if (message.senderId.toString() !== userId) {
        throw genericErrors.forbidden('You can only edit your own messages');
      }

      if (message.isDeleted) {
        throw genericErrors.badRequest('Cannot edit deleted message');
      }

      message.content = newContent;
      message.isEdited = true;
      message.editedAt = new Date();

      await message.save();

      await message.populate('senderId', 'firstName lastName email profileImage');
      await message.populate('receiverId', 'firstName lastName email profileImage');

      return message;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a message
   */
  static async deleteMessage(messageId, userId) {
    try {
      const message = await Message.findById(messageId);

      if (!message) {
        throw genericErrors.notFound('Message not found');
      }

      if (message.senderId.toString() !== userId) {
        throw genericErrors.forbidden('You can only delete your own messages');
      }

      await message.softDelete();

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get recent conversations for user
   */
  static async getRecentConversations(userId, limit = 10) {
    try {
      const conversations = await Message.aggregate([
        {
          $match: {
            $or: [
              { senderId: userId },
              { receiverId: userId }
            ],
            isDeleted: false,
          }
        },
        {
          $addFields: {
            otherUserId: {
              $cond: {
                if: { $eq: ['$senderId', userId] },
                then: '$receiverId',
                else: '$senderId'
              }
            }
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $group: {
            _id: '$otherUserId',
            lastMessage: { $first: '$$ROOT' },
            unreadCount: {
              $sum: {
                $cond: {
                  if: {
                    $and: [
                      { $eq: ['$receiverId', userId] },
                      { $in: ['$status', ['sent', 'delivered']] }
                    ]
                  },
                  then: 1,
                  else: 0
                }
              }
            }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'otherUser'
          }
        },
        {
          $unwind: '$otherUser'
        },
        {
          $project: {
            _id: 1,
            lastMessage: 1,
            unreadCount: 1,
            otherUser: {
              _id: 1,
              firstName: 1,
              lastName: 1,
              email: 1,
              profileImage: 1,
            }
          }
        },
        {
          $sort: { 'lastMessage.createdAt': -1 }
        },
        {
          $limit: parseInt(limit)
        }
      ]);

      return conversations;
    } catch (error) {
      throw error;
    }
  }
}

export default MessageService;
