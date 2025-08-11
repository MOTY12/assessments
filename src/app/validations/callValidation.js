import Joi from 'joi';

// Validation for starting a call
export const startCallSchema = Joi.object({
  receiverId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Receiver ID must be a valid MongoDB ObjectId',
      'any.required': 'Receiver ID is required'
    }),
  type: Joi.string()
    .valid('voice', 'video')
    .default('voice')
    .messages({
      'any.only': 'Call type must be either voice or video'
    })
});

// Validation for ending a call
export const endCallSchema = Joi.object({
  callId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Call ID must be a valid MongoDB ObjectId',
      'any.required': 'Call ID is required'
    }),
  reason: Joi.string()
    .valid('completed', 'cancelled', 'failed', 'timeout', 'busy')
    .default('completed')
    .messages({
      'any.only': 'End reason must be one of: completed, cancelled, failed, timeout, busy'
    })
});

// Validation for answering a call
export const answerCallSchema = Joi.object({
  callId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Call ID must be a valid MongoDB ObjectId',
      'any.required': 'Call ID is required'
    })
});

// Validation for declining a call
export const declineCallSchema = Joi.object({
  callId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Call ID must be a valid MongoDB ObjectId',
      'any.required': 'Call ID is required'
    })
});

// Validation for call history query parameters
export const callHistorySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.min': 'Page must be a positive integer'
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      'number.min': 'Limit must be a positive integer',
      'number.max': 'Limit cannot exceed 100'
    }),
  type: Joi.string()
    .valid('voice', 'video')
    .optional()
    .messages({
      'any.only': 'Call type must be either voice or video'
    }),
  status: Joi.string()
    .valid('pending', 'answered', 'ended', 'missed', 'declined')
    .optional()
    .messages({
      'any.only': 'Status must be one of: pending, answered, ended, missed, declined'
    })
});
