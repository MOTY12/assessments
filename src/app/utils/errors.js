class ApiError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

const genericErrors = {
  notFoundApi: new ApiError('API endpoint not found', 404),
  
  unauthorized: new ApiError('Unauthorized access', 401),
  
  forbidden: new ApiError('Access forbidden', 403),
  
  validationError: (message = 'Validation failed') => 
    new ApiError(message, 422),
    
  badRequest: (message = 'Bad request') => 
    new ApiError(message, 400),
    
  conflict: (message = 'Resource conflict') => 
    new ApiError(message, 409),
    
  serverError: (message = 'Internal server error') => 
    new ApiError(message, 500),
    
  notFound: (resource = 'Resource') => 
    new ApiError(`${resource} not found`, 404),
    
  alreadyExists: (resource = 'Resource') => 
    new ApiError(`${resource} already exists`, 409),
};

export default genericErrors;
export { ApiError };
