import express from 'express';
import MessageController from '../controllers/MessageController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticate);

// Message routes
router.get('/chat/:userId', MessageController.getChatHistory);
router.post('/send', MessageController.sendMessage);
router.put('/read', MessageController.markMessagesAsRead);
router.get('/unread', MessageController.getUnreadCount);
router.put('/:messageId', MessageController.editMessage);
router.delete('/:messageId', MessageController.deleteMessage);
router.get('/conversations', MessageController.getRecentConversations);

export default router;
