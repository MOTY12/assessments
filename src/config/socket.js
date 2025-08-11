import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import MessageService from '../app/services/MessageService.js';
import CallService from '../app/services/CallService.js';
import { logger } from '../app/utils/index.js';

class SocketHandler {
  constructor() {
    this.io = null; // Will be set by configureSocket function
    this.connectedUsers = new Map(); // userId -> socketId
    this.userSockets = new Map(); // socketId -> userId
  }

  /**
   * Setup Socket.IO middleware
   */
  setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
          return next(new Error('Authentication token required'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        socket.user = decoded;
        
        next();
      } catch (error) {
        logger.error('Socket authentication error:', error);
        next(new Error('Invalid token'));
      }
    });
  }

  /**
   * Setup event handlers
   */
  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      this.handleConnection(socket);
    });
  }

  /**
   * Handle new socket connection
   */
  handleConnection(socket) {
    const userId = socket.userId;
    
    logger.info(`User ${userId} connected with socket ${socket.id}`);

    // Store user connection
    this.connectedUsers.set(userId, socket.id);
    this.userSockets.set(socket.id, userId);

    // Join user to their personal room
    socket.join(`user_${userId}`);

    // Send online status to user's contacts
    this.broadcastUserStatus(userId, 'online');

    // Handle messaging events
    this.handleMessagingEvents(socket);

    // Handle call events
    this.handleCallEvents(socket);

    // Handle disconnection
    socket.on('disconnect', () => {
      this.handleDisconnection(socket);
    });

    // Handle typing events
    socket.on('typing', (data) => {
      this.handleTyping(socket, data);
    });

    socket.on('stop_typing', (data) => {
      this.handleStopTyping(socket, data);
    });
  }

  /**
   * Handle messaging events
   */
  handleMessagingEvents(socket) {
    // Send message
    socket.on('send_message', async (data) => {
      try {
        const { receiverId, content, type = 'text', replyTo = null } = data;
        
        // Send message via service
        const message = await MessageService.sendMessage(
          socket.userId,
          receiverId,
          content,
          type,
          replyTo
        );

        // Emit to sender (confirmation)
        socket.emit('message_sent', {
          success: true,
          message,
        });

        // Emit to receiver if online
        const receiverSocketId = this.connectedUsers.get(receiverId);
        if (receiverSocketId) {
          this.io.to(receiverSocketId).emit('new_message', message);
        }

        logger.info(`Message sent from ${socket.userId} to ${receiverId}`);
      } catch (error) {
        logger.error('Send message error:', error);
        socket.emit('message_error', {
          success: false,
          error: error.message,
        });
      }
    });

    // Mark messages as read
    socket.on('mark_as_read', async (data) => {
      try {
        const { senderId } = data;
        
        await MessageService.markMessagesAsRead(senderId, socket.userId);
        
        // Notify sender that messages were read
        const senderSocketId = this.connectedUsers.get(senderId);
        if (senderSocketId) {
          this.io.to(senderSocketId).emit('messages_read', {
            readBy: socket.userId,
          });
        }

        socket.emit('messages_marked_read', { success: true });
      } catch (error) {
        logger.error('Mark as read error:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Edit message
    socket.on('edit_message', async (data) => {
      try {
        const { messageId, newContent } = data;
        
        const message = await MessageService.editMessage(messageId, socket.userId, newContent);
        
        // Emit to both sender and receiver
        socket.emit('message_edited', message);
        
        const receiverSocketId = this.connectedUsers.get(message.receiverId._id);
        if (receiverSocketId) {
          this.io.to(receiverSocketId).emit('message_edited', message);
        }
      } catch (error) {
        logger.error('Edit message error:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Delete message
    socket.on('delete_message', async (data) => {
      try {
        const { messageId } = data;
        
        await MessageService.deleteMessage(messageId, socket.userId);
        
        // Emit to both sender and receiver
        socket.emit('message_deleted', { messageId });
        
        // Note: In a real app, you'd need to get the receiver ID from the message
        // For now, we'll broadcast to all connected users
        socket.broadcast.emit('message_deleted', { messageId });
      } catch (error) {
        logger.error('Delete message error:', error);
        socket.emit('error', { message: error.message });
      }
    });
  }

  /**
   * Handle call events
   */
  handleCallEvents(socket) {
    // Start call
    socket.on('start_call', async (data) => {
      try {
        const { receiverId, type = 'voice' } = data;
        
        const call = await CallService.startCall(socket.userId, receiverId, type);
        
        // Emit to caller
        socket.emit('call_started', call);
        
        // Emit to receiver if online
        const receiverSocketId = this.connectedUsers.get(receiverId);
        if (receiverSocketId) {
          this.io.to(receiverSocketId).emit('incoming_call', call);
        }

        logger.info(`Call started from ${socket.userId} to ${receiverId}`);
      } catch (error) {
        logger.error('Start call error:', error);
        socket.emit('call_error', { message: error.message });
      }
    });

    // Answer call
    socket.on('answer_call', async (data) => {
      try {
        const { callId } = data;
        
        const call = await CallService.answerCall(callId, socket.userId);
        
        // Emit to both caller and receiver
        socket.emit('call_answered', call);
        
        const callerSocketId = this.connectedUsers.get(call.callerId._id);
        if (callerSocketId) {
          this.io.to(callerSocketId).emit('call_answered', call);
        }
      } catch (error) {
        logger.error('Answer call error:', error);
        socket.emit('call_error', { message: error.message });
      }
    });

    // Decline call
    socket.on('decline_call', async (data) => {
      try {
        const { callId } = data;
        
        const call = await CallService.declineCall(callId, socket.userId);
        
        // Emit to both caller and receiver
        socket.emit('call_declined', call);
        
        const callerSocketId = this.connectedUsers.get(call.callerId._id);
        if (callerSocketId) {
          this.io.to(callerSocketId).emit('call_declined', call);
        }
      } catch (error) {
        logger.error('Decline call error:', error);
        socket.emit('call_error', { message: error.message });
      }
    });

    // End call
    socket.on('end_call', async (data) => {
      try {
        const { callId, reason = 'completed' } = data;
        
        const call = await CallService.endCall(callId, socket.userId, reason);
        
        // Emit to both participants
        socket.emit('call_ended', call);
        
        const otherUserId = call.callerId._id === socket.userId ? call.receiverId._id : call.callerId._id;
        const otherSocketId = this.connectedUsers.get(otherUserId);
        if (otherSocketId) {
          this.io.to(otherSocketId).emit('call_ended', call);
        }
      } catch (error) {
        logger.error('End call error:', error);
        socket.emit('call_error', { message: error.message });
      }
    });
  }

  /**
   * Handle typing events
   */
  handleTyping(socket, data) {
    const { receiverId } = data;
    const receiverSocketId = this.connectedUsers.get(receiverId);
    
    if (receiverSocketId) {
      this.io.to(receiverSocketId).emit('user_typing', {
        userId: socket.userId,
        isTyping: true,
      });
    }
  }

  /**
   * Handle stop typing events
   */
  handleStopTyping(socket, data) {
    const { receiverId } = data;
    const receiverSocketId = this.connectedUsers.get(receiverId);
    
    if (receiverSocketId) {
      this.io.to(receiverSocketId).emit('user_typing', {
        userId: socket.userId,
        isTyping: false,
      });
    }
  }

  /**
   * Handle disconnection
   */
  handleDisconnection(socket) {
    const userId = socket.userId;
    
    logger.info(`User ${userId} disconnected`);

    // Remove user from connected users
    this.connectedUsers.delete(userId);
    this.userSockets.delete(socket.id);

    // End any active calls
    CallService.endUserActiveCalls(userId, 'user_disconnected');

    // Broadcast offline status
    this.broadcastUserStatus(userId, 'offline');
  }

  /**
   * Broadcast user status to contacts
   */
  broadcastUserStatus(userId, status) {
    // In a real app, you'd get the user's contacts and broadcast to them
    // For now, we'll broadcast to all connected users
    this.io.emit('user_status', {
      userId,
      status,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Get connected users count
   */
  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  /**
   * Check if user is online
   */
  isUserOnline(userId) {
    return this.connectedUsers.has(userId);
  }
}

/**
 * Configure Socket.IO with the provided server instance
 * @param {Server} io - Socket.IO server instance
 * @returns {SocketHandler} - Socket handler instance
 */
export function configureSocket(io) {
  const socketHandler = new SocketHandler();
  socketHandler.io = io;
  socketHandler.connectedUsers = new Map();
  socketHandler.userSockets = new Map();
  
  socketHandler.setupMiddleware();
  socketHandler.setupEventHandlers();
  
  return socketHandler;
}

export default SocketHandler;
