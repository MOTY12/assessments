import { genericErrors, Helper } from '../utils/index.js';
import Call from '../models/Call.js';
import UserService from './UserService.js';

class CallService {
  /**
   * Start a call
   */
  static async startCall(callerId, receiverId, type = 'voice') {
    try {
      // Validate caller and receiver exist
      const caller = await UserService.getCurrentUserProfile(callerId);
      const receiver = await UserService.getCurrentUserProfile(receiverId);

      if (!caller) {
        throw genericErrors.notFound('Caller not found');
      }

      if (!receiver) {
        throw genericErrors.notFound('Receiver not found');
      }

      if (callerId === receiverId) {
        throw genericErrors.badRequest('Cannot call yourself');
      }

      // Check if caller already has an active call
      const callerActiveCall = await Call.getActiveCall(callerId);
      if (callerActiveCall) {
        throw genericErrors.conflict('You already have an active call');
      }

      // Check if receiver already has an active call
      const receiverActiveCall = await Call.getActiveCall(receiverId);
      if (receiverActiveCall) {
        throw genericErrors.conflict('Receiver is already on a call');
      }

      // Generate unique call ID
      const callId = Call.generateCallId();

      // Create call record
      const call = new Call({
        callerId,
        receiverId,
        callId,
        type,
        status: 'initiated',
        startTime: new Date(),
      });

      await call.save();

      // Populate caller and receiver info
      await call.populate('callerId', 'firstName lastName email profileImage');
      await call.populate('receiverId', 'firstName lastName email profileImage');

      // Mock call initiation logic
      setTimeout(() => {
        this.updateCallStatus(call._id, 'ringing');
      }, 1000);

      return call;
    } catch (error) {
      throw error;
    }
  }

  /**
   * End a call
   */
  static async endCall(callId, userId, reason = 'completed') {
    try {
      const call = await Call.findOne({ 
        callId,
        $or: [
          { callerId: userId },
          { receiverId: userId }
        ],
        isActive: true,
      });

      if (!call) {
        throw genericErrors.notFound('Call not found or already ended');
      }

      if (!['initiated', 'ringing', 'answered'].includes(call.status)) {
        throw genericErrors.badRequest('Call is not active');
      }

      // End the call
      await call.endCall(reason);

      // Populate caller and receiver info
      await call.populate('callerId', 'firstName lastName email profileImage');
      await call.populate('receiverId', 'firstName lastName email profileImage');

      return call;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Answer a call
   */
  static async answerCall(callId, userId) {
    try {
      const call = await Call.findOne({ 
        callId,
        receiverId: userId,
        status: { $in: ['initiated', 'ringing'] },
        isActive: true,
      });

      if (!call) {
        throw genericErrors.notFound('Call not found or cannot be answered');
      }

      await call.answerCall();

      // Populate caller and receiver info
      await call.populate('callerId', 'firstName lastName email profileImage');
      await call.populate('receiverId', 'firstName lastName email profileImage');

      return call;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Decline a call
   */
  static async declineCall(callId, userId) {
    try {
      const call = await Call.findOne({ 
        callId,
        receiverId: userId,
        status: { $in: ['initiated', 'ringing'] },
        isActive: true,
      });

      if (!call) {
        throw genericErrors.notFound('Call not found or cannot be declined');
      }

      await call.declineCall();

      // Populate caller and receiver info
      await call.populate('callerId', 'firstName lastName email profileImage');
      await call.populate('receiverId', 'firstName lastName email profileImage');

      return call;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get call history for user
   */
  static async getCallHistory(userId, page = 1, limit = 20, type = null, status = null) {
    try {
      const calls = await Call.getCallHistory(userId, { page, limit, type, status });
      
      return {
        calls,
        pagination: Helper.paginationData(page, limit, calls.length),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get active call for user
   */
  static async getActiveCall(userId) {
    try {
      const call = await Call.getActiveCall(userId);
      return call;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update call status (internal method)
   */
  static async updateCallStatus(callId, status) {
    try {
      const call = await Call.findById(callId);
      if (call) {
        call.status = status;
        await call.save();
      }
    } catch (error) {
      console.error('Error updating call status:', error);
    }
  }

  /**
   * Get call statistics for user
   */
  static async getCallStats(userId) {
    try {
      const stats = await Call.aggregate([
        {
          $match: {
            $or: [
              { callerId: userId },
              { receiverId: userId }
            ],
            isActive: true,
          }
        },
        {
          $group: {
            _id: null,
            totalCalls: { $sum: 1 },
            totalDuration: { $sum: '$duration' },
            answeredCalls: {
              $sum: {
                $cond: [{ $eq: ['$status', 'answered'] }, 1, 0]
              }
            },
            missedCalls: {
              $sum: {
                $cond: [{ $eq: ['$status', 'missed'] }, 1, 0]
              }
            },
            voiceCalls: {
              $sum: {
                $cond: [{ $eq: ['$type', 'voice'] }, 1, 0]
              }
            },
            videoCalls: {
              $sum: {
                $cond: [{ $eq: ['$type', 'video'] }, 1, 0]
              }
            },
          }
        }
      ]);

      return stats[0] || {
        totalCalls: 0,
        totalDuration: 0,
        answeredCalls: 0,
        missedCalls: 0,
        voiceCalls: 0,
        videoCalls: 0,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mock call quality update
   */
  static async updateCallQuality(callId, quality) {
    try {
      const call = await Call.findById(callId);
      if (call) {
        call.quality = quality;
        await call.save();
      }
    } catch (error) {
      console.error('Error updating call quality:', error);
    }
  }

  /**
   * End all active calls for a user (when they disconnect)
   */
  static async endUserActiveCalls(userId, reason = 'user_disconnected') {
    try {
      return await Call.endUserActiveCalls(userId, reason);
    } catch (error) {
      console.error('Error ending user active calls:', error);
    }
  }
}

export default CallService;
