import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';
import walletRoutes from './walletRoutes.js';
import messageRoutes from './messageRoutes.js';
import callRoutes from './callRoutes.js';

class Routes {
  static routes(app) {
    const baseUrl = '/api';
    
    // Authentication routes
    app.use(`${baseUrl}`, authRoutes);
    
    // User routes
    app.use(`${baseUrl}`, userRoutes);
    
    // Wallet routes
    app.use(`${baseUrl}/wallet`, walletRoutes);
    
    // Message routes
    app.use(`${baseUrl}/messages`, messageRoutes);
    
    // Call routes
    app.use(`${baseUrl}/call`, callRoutes);
    
    // Root endpoint
    app.get('/', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Welcome to Assessment API',
        version: '1.0.0',
        documentation: `${req.protocol}://${req.get('host')}/api/docs`,
      });
    });
  }
}

export default Routes;
