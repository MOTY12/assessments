import { Helper } from '../utils/index.js';
import CallService from '../services/CallService.js';

class CallController {
  /**
   * Start a call
   */
  static async startCall(req, res, next) {
    try {
      const userId = req.user.userId;
      const { receiverId, type = 'voice' } = req.body;
      
      const call = await CallService.startCall(userId, receiverId, type);
      
      return Helper.successResponse(
        req,
        res,
        call,
        201,
        'Call started successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * End a call
   */
  static async endCall(req, res, next) {
    try {
      const userId = req.user.userId;
      const { callId, reason = 'completed' } = req.body;
      
      const call = await CallService.endCall(callId, userId, reason);
      
      return Helper.successResponse(
        req,
        res,
        call,
        200,
        'Call ended successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Answer a call
   */
  static async answerCall(req, res, next) {
    try {
      const userId = req.user.userId;
      const { callId } = req.body;
      
      const call = await CallService.answerCall(callId, userId);
      
      return Helper.successResponse(
        req,
        res,
        call,
        200,
        'Call answered successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Decline a call
   */
  static async declineCall(req, res, next) {
    try {
      const userId = req.user.userId;
      const { callId } = req.body;
      
      const call = await CallService.declineCall(callId, userId);
      
      return Helper.successResponse(
        req,
        res,
        call,
        200,
        'Call declined successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get call history
   */
  static async getCallHistory(req, res, next) {
    try {
      const userId = req.user.userId;
      const { page = 1, limit = 20, type = null, status = null } = req.query;
      
      const result = await CallService.getCallHistory(userId, page, limit, type, status);
      
      return Helper.successResponse(
        req,
        res,
        result,
        200,
        'Call history retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get active call
   */
  static async getActiveCall(req, res, next) {
    try {
      const userId = req.user.userId;
      
      const call = await CallService.getActiveCall(userId);
      
      return Helper.successResponse(
        req,
        res,
        { call },
        200,
        call ? 'Active call found' : 'No active call'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get call statistics
   */
  static async getCallStats(req, res, next) {
    try {
      const userId = req.user.userId;
      
      const stats = await CallService.getCallStats(userId);
      
      return Helper.successResponse(
        req,
        res,
        stats,
        200,
        'Call statistics retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}

export default CallController;
