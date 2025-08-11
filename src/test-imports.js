#!/usr/bin/env node

// Test file to check all imports and basic server functionality
import dotenv from 'dotenv';

console.log('🔍 Testing server imports and configuration...');

// Load environment variables
dotenv.config();
console.log('✅ Environment variables loaded');

try {
  // Test Socket.IO import
  const { Server } = await import('socket.io');
  console.log('✅ Socket.IO imported successfully');

  // Test express config import
  const app = await import('./config/express.js');
  console.log('✅ Express config imported successfully');

  // Test database config import
  const Database = await import('./config/database.js');
  console.log('✅ Database config imported successfully');

  // Test socket config import
  const { configureSocket } = await import('./config/socket.js');
  console.log('✅ Socket config imported successfully');

  // Test models
  const User = await import('./app/models/User.js');
  console.log('✅ User model imported successfully');

  const Message = await import('./app/models/Message.js');
  console.log('✅ Message model imported successfully');

  const Call = await import('./app/models/Call.js');
  console.log('✅ Call model imported successfully');

  // Test services
  const MessageService = await import('./app/services/MessageService.js');
  console.log('✅ MessageService imported successfully');

  const CallService = await import('./app/services/CallService.js');
  console.log('✅ CallService imported successfully');

  // Test controllers
  const MessageController = await import('./app/controllers/MessageController.js');
  console.log('✅ MessageController imported successfully');

  const CallController = await import('./app/controllers/CallController.js');
  console.log('✅ CallController imported successfully');

  console.log('\n🎉 All imports successful! Server should start without import errors.');
  
} catch (error) {
  console.error('❌ Import error found:', error.message);
  console.error('Stack trace:', error.stack);
}
