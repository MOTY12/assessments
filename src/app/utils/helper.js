class Helper {
  /**
   * Success response handler
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Object} data - Response data
   * @param {Number} code - Status code
   * @param {String} message - Response message
   */
  static successResponse(req, res, data, code = 200, message = 'Success') {
    return res.status(code).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Error response handler
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Object} error - Error object
   */
  static errorResponse(req, res, error) {
    const statusCode = error.statusCode || error.status || 500;
    const message = error.message || 'Internal server error';
    
    // Log error for debugging
    console.error('Error:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
    });

    return res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? {
        stack: error.stack,
        details: error.details || null,
      } : null,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Validation error response handler
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Object} errors - Validation errors
   */
  static validationErrorResponse(req, res, errors) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Pagination helper
   * @param {Number} page - Current page
   * @param {Number} limit - Items per page
   * @param {Number} total - Total items
   */
  static paginationData(page = 1, limit = 10, total = 0) {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      currentPage: parseInt(page),
      totalPages,
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNext,
      hasPrev,
    };
  }

  /**
   * Generate random string
   * @param {Number} length - String length
   */
  static generateRandomString(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

export default Helper;
