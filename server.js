#!/usr/bin/env node

// Simple server startup with better error handling
import dotenv from 'dotenv';

// Load environment first
dotenv.config();

console.log('🚀 Initializing Assessment API...');
console.log('📍 Working directory:', process.cwd());
console.log('🔧 Environment:', process.env.NODE_ENV || 'development');

try {
    // Import modules with error handling
    console.log('📦 Loading application modules...');
    
    const { createServer } = await import('http');
    const { Server } = await import('socket.io');
    
    // Import our modules
    const appModule = await import('./src/config/express.js');
    const app = appModule.default;
    
    const databaseModule = await import('./src/config/database.js');
    const Database = databaseModule.default;
    
    const socketModule = await import('./src/config/socket.js');
    const { configureSocket } = socketModule;
    
    console.log('✅ Modules loaded successfully');
    
    // Initialize database
    console.log('🗄️  Connecting to database...');
    await Database.getInstance();
    console.log('✅ Database connected');
    
    // Create HTTP server
    const httpServer = createServer(app);
    
    // Initialize Socket.IO
    console.log('🔌 Initializing Socket.IO...');
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.ALLOWED_ORIGINS?.split(',') || ["http://localhost:3000"],
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    
    // Configure Socket.IO
    configureSocket(io);
    console.log('✅ Socket.IO configured');
    
    // Start server
    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
        console.log('');
        console.log('🎉 Assessment API Started Successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📝 REST API: http://localhost:${PORT}/api`);
        console.log(`🔌 Socket.IO: http://localhost:${PORT}/socket.io/`);
        console.log(`💻 Test Client: Open socketio-test-client.html in browser`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');
        console.log('📋 Quick Test Steps:');
        console.log('1. Open socketio-test-client.html in browser');
        console.log('2. Click "Setup Test Users"');
        console.log('3. Click "Use Sample Token"'); 
        console.log('4. Click "Connect to Socket.IO"');
        console.log('');
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('🛑 SIGTERM received, shutting down gracefully');
        httpServer.close(() => {
            console.log('✅ Server closed');
            process.exit(0);
        });
    });
    
    process.on('SIGINT', () => {
        console.log('🛑 SIGINT received, shutting down gracefully');
        httpServer.close(() => {
            console.log('✅ Server closed');
            process.exit(0);
        });
    });
    
} catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
}
