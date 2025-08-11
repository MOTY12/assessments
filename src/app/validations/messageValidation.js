import Joi from 'joi';

// Validation for sending a message
export const sendMessageSchema = Joi.object({
  receiverId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Receiver ID must be a valid MongoDB ObjectId',
      'any.required': 'Receiver ID is required'
    }),
  content: Joi.string()
    .required()
    .min(1)
    .max(1000)
    .trim()
    .messages({
      'string.min': 'Message content cannot be empty',
      'string.max': 'Message content cannot exceed 1000 characters',
      'any.required': 'Message content is required'
    }),
  type: Joi.string()
    .valid('text', 'image', 'file', 'audio')
    .default('text')
    .messages({
      'any.only': 'Message type must be one of: text, image, file, audio'
    })
});

// Validation for marking messages as read
export const markAsReadSchema = Joi.object({
  senderId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Sender ID must be a valid MongoDB ObjectId',
      'any.required': 'Sender ID is required'
    }),
  messageIds: Joi.array()
    .items(
      Joi.string().pattern(/^[0-9a-fA-F]{24}$/)
    )
    .optional()
    .messages({
      'string.pattern.base': 'Each message ID must be a valid MongoDB ObjectId'
    })
});

// Validation for editing a message
export const editMessageSchema = Joi.object({
  content: Joi.string()
    .required()
    .min(1)
    .max(1000)
    .trim()
    .messages({
      'string.min': 'Message content cannot be empty',
      'string.max': 'Message content cannot exceed 1000 characters',
      'any.required': 'Message content is required'
    })
});

// Validation for chat history query parameters
export const chatHistorySchema = Joi.object({
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
  before: Joi.date()
    .optional()
    .messages({
      'date.base': 'Before parameter must be a valid date'
    })
});

// Validation for user ID parameter
export const userIdSchema = Joi.object({
  userId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'User ID must be a valid MongoDB ObjectId',
      'any.required': 'User ID is required'
    })
});

// Validation for message ID parameter
export const messageIdSchema = Joi.object({
  messageId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Message ID must be a valid MongoDB ObjectId',
      'any.required': 'Message ID is required'
    })
});
