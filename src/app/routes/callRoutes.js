import express from 'express';
import CallController from '../controllers/CallController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticate);

// Call routes
router.post('/start', CallController.startCall);
router.post('/end', CallController.endCall);
router.post('/answer', CallController.answerCall);
router.post('/decline', CallController.declineCall);
router.get('/history', CallController.getCallHistory);
router.get('/active', CallController.getActiveCall);
router.get('/stats', CallController.getCallStats);

export default router;
