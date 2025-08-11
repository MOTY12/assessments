import AuthService from '../services/AuthService.js';
import { genericErrors } from '../utils/index.js';

/**
 * Authentication middleware
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
   
    if (!authHeader) {
      throw genericErrors.unauthorized;
    }
    
    const token = authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      throw genericErrors.unauthorized;
    }
    
    const decoded = AuthService.verifyToken(token);
    req.user = decoded;
    
    next();
  } catch (error) {
    next(genericErrors.unauthorized);
  }
};

/**
 * Role-based authorization middleware
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(genericErrors.unauthorized);
    }
    
    if (!roles.includes(req.user.role)) {
      return next(genericErrors.forbidden);
    }
    
    next();
  };
};
