import { validationResult } from 'express-validator';
import { Helper } from '../utils/index.js';

/**
 * Validation middleware to handle express-validator results
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().reduce((acc, error) => {
      acc[error.path] = error.msg;
      return acc;
    }, {});
    
    return Helper.validationErrorResponse(req, res, formattedErrors);
  }
  
  next();
};
