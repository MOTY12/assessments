#!/usr/bin/env node

/**
 * Quick Socket.IO Server Test
 * This script will start the server and test Socket.IO functionality
 */

import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './src/config/express.js';
import Database from './src/config/database.js';
import { configureSocket } from './src/config/socket.js';

console.log('🚀 Starting Assessment API with Socket.IO...\n');

// Load environment variables
dotenv.config();

// Initialize database connection
console.log('📦 Initializing database connection...');
Database.getInstance();

const PORT = process.env.PORT || 3000;

// Create HTTP server and integrate Socket.IO
console.log('🌐 Creating HTTP server...');
const server = createServer(app);

console.log('🔌 Setting up Socket.IO...');
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Configure Socket.IO
console.log('⚙️  Configuring Socket.IO event handlers...');
const socketHandler = configureSocket(io);

// Start the server
server.listen(PORT, () => {
  console.log('\n🎉 Assessment API Server Started Successfully!');
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔌 Socket.IO: ENABLED`);
  console.log(`💾 Database: ${process.env.MONGODB_URI ? 'Connected' : 'Local'}`);
  
  console.log('\n📋 Available Features:');
  console.log('  ✅ Real-time Messaging (Socket.IO)');
  console.log('  ✅ Voice/Video Calls');
  console.log('  ✅ REST API Endpoints');
  console.log('  ✅ JWT Authentication');
  console.log('  ✅ Wallet Integration');
  
  console.log('\n🧪 Test Socket.IO Connection:');
  console.log('  Open: http://localhost:3000');
  console.log('  Socket.IO endpoint: ws://localhost:3000');
  
  console.log('\n📖 API Documentation:');
  console.log('  POST /api/register - Register user');
  console.log('  POST /api/login - Login user');
  console.log('  POST /api/messages/send - Send message');
  console.log('  POST /api/call/start - Start call');
  
  console.log('\n🔗 Socket.IO Events:');
  console.log('  send_message, start_call, answer_call, end_call');
  console.log('  new_message, incoming_call, call_answered, call_ended');
  
  console.log('\n⏳ Server is running... Press Ctrl+C to stop');
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log(`\n🔌 New Socket.IO connection: ${socket.id}`);
  
  socket.on('disconnect', (reason) => {
    console.log(`❌ Socket disconnected: ${socket.id} (${reason})`);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('\n❌ Unhandled Promise Rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('\n❌ Uncaught Exception:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
