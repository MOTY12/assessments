#!/usr/bin/env node

/**
 * Socket.IO Client Test Script
 * This script simulates a Socket.IO client for testing
 */

import { io } from 'socket.io-client';
import readline from 'readline';

// Test configuration
const SERVER_URL = 'http://localhost:3000';
let socket = null;
let currentUserId = null;

// Sample test data
const testData = {
  users: {
    alice: {
      email: 'alice@test.com',
      password: 'password123',
      token: null,
      userId: null
    },
    bob: {
      email: 'bob@test.com', 
      password: 'password123',
      token: null,
      userId: null
    }
  },
  messages: [
    'Hello! How are you today?',
    'This is a test message from Socket.IO',
    'Real-time messaging is working great!',
    'Can you see this message instantly?',
    'Socket.IO testing is fun! 🚀'
  ],
  callTypes: ['voice', 'video']
};

// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const icons = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    message: '💬',
    call: '📞'
  };
  console.log(`${icons[type]} [${timestamp}] ${message}`);
}

function connectSocket(token) {
  if (socket) {
    socket.disconnect();
  }

  log('Connecting to Socket.IO server...', 'info');
  
  socket = io(SERVER_URL, {
    auth: {
      token: `Bearer ${token}`
    }
  });

  // Connection events
  socket.on('connect', () => {
    log('Connected to Socket.IO server!', 'success');
    currentUserId = socket.userId;
    showMenu();
  });

  socket.on('disconnect', (reason) => {
    log(`Disconnected: ${reason}`, 'warning');
  });

  socket.on('connect_error', (error) => {
    log(`Connection error: ${error.message}`, 'error');
  });

  // Message events
  socket.on('new_message', (data) => {
    log(`New message from ${data.senderId}: "${data.content}"`, 'message');
  });

  socket.on('message_sent', (data) => {
    log('Message sent successfully!', 'success');
  });

  socket.on('message_error', (data) => {
    log(`Message error: ${data.error}`, 'error');
  });

  socket.on('user_typing', (data) => {
    log(`User ${data.userId} is ${data.isTyping ? 'typing' : 'stopped typing'}`, 'info');
  });

  // Call events
  socket.on('incoming_call', (data) => {
    log(`Incoming ${data.type} call from ${data.callerId}! Call ID: ${data._id}`, 'call');
    testData.lastCallId = data._id;
  });

  socket.on('call_started', (data) => {
    log(`Call started! Call ID: ${data._id}`, 'call');
    testData.lastCallId = data._id;
  });

  socket.on('call_answered', (data) => {
    log('Call was answered!', 'success');
  });

  socket.on('call_declined', (data) => {
    log('Call was declined', 'warning');
  });

  socket.on('call_ended', (data) => {
    log(`Call ended. Duration: ${data.duration}ms`, 'info');
  });

  socket.on('call_error', (data) => {
    log(`Call error: ${data.message}`, 'error');
  });

  // Status events
  socket.on('user_status', (data) => {
    log(`User ${data.userId} is ${data.status}`, 'info');
  });
}

function showMenu() {
  console.log('\n🧪 Socket.IO Test Menu:');
  console.log('1. Send test message');
  console.log('2. Send random message'); 
  console.log('3. Start typing indicator');
  console.log('4. Stop typing indicator');
  console.log('5. Start voice call');
  console.log('6. Start video call');
  console.log('7. Answer call');
  console.log('8. Decline call');
  console.log('9. End call');
  console.log('10. Send multiple messages (stress test)');
  console.log('11. Disconnect');
  console.log('0. Exit');
  
  rl.question('\nSelect an option: ', handleMenuChoice);
}

function handleMenuChoice(choice) {
  switch (choice) {
    case '1':
      sendTestMessage();
      break;
    case '2':
      sendRandomMessage();
      break;
    case '3':
      startTyping();
      break;
    case '4':
      stopTyping();
      break;
    case '5':
      startCall('voice');
      break;
    case '6':
      startCall('video');
      break;
    case '7':
      answerCall();
      break;
    case '8':
      declineCall();
      break;
    case '9':
      endCall();
      break;
    case '10':
      stressTestMessages();
      break;
    case '11':
      disconnectSocket();
      break;
    case '0':
      exit();
      break;
    default:
      log('Invalid option', 'error');
      showMenu();
  }
}

function sendTestMessage() {
  rl.question('Enter receiver User ID: ', (receiverId) => {
    rl.question('Enter message content (or press Enter for default): ', (content) => {
      const message = content || testData.messages[0];
      
      socket.emit('send_message', {
        receiverId: receiverId,
        content: message,
        type: 'text'
      });
      
      log(`Sent message: "${message}"`, 'message');
      setTimeout(showMenu, 1000);
    });
  });
}

function sendRandomMessage() {
  rl.question('Enter receiver User ID: ', (receiverId) => {
    const randomMessage = testData.messages[Math.floor(Math.random() * testData.messages.length)];
    
    socket.emit('send_message', {
      receiverId: receiverId,
      content: randomMessage,
      type: 'text'
    });
    
    log(`Sent random message: "${randomMessage}"`, 'message');
    setTimeout(showMenu, 1000);
  });
}

function startTyping() {
  rl.question('Enter receiver User ID: ', (receiverId) => {
    socket.emit('typing', { receiverId: receiverId });
    log('Started typing indicator', 'info');
    setTimeout(showMenu, 1000);
  });
}

function stopTyping() {
  rl.question('Enter receiver User ID: ', (receiverId) => {
    socket.emit('stop_typing', { receiverId: receiverId });
    log('Stopped typing indicator', 'info');
    setTimeout(showMenu, 1000);
  });
}

function startCall(type) {
  rl.question('Enter receiver User ID: ', (receiverId) => {
    socket.emit('start_call', {
      receiverId: receiverId,
      type: type
    });
    
    log(`Started ${type} call`, 'call');
    setTimeout(showMenu, 1000);
  });
}

function answerCall() {
  if (!testData.lastCallId) {
    log('No call ID available. Start a call first.', 'warning');
    showMenu();
    return;
  }
  
  socket.emit('answer_call', {
    callId: testData.lastCallId
  });
  
  log('Answered call', 'success');
  setTimeout(showMenu, 1000);
}

function declineCall() {
  if (!testData.lastCallId) {
    log('No call ID available. Start a call first.', 'warning');
    showMenu();
    return;
  }
  
  socket.emit('decline_call', {
    callId: testData.lastCallId
  });
  
  log('Declined call', 'warning');
  setTimeout(showMenu, 1000);
}

function endCall() {
  if (!testData.lastCallId) {
    log('No call ID available. Start a call first.', 'warning');
    showMenu();
    return;
  }
  
  socket.emit('end_call', {
    callId: testData.lastCallId,
    reason: 'completed'
  });
  
  log('Ended call', 'info');
  setTimeout(showMenu, 1000);
}

function stressTestMessages() {
  rl.question('Enter receiver User ID: ', (receiverId) => {
    rl.question('How many messages to send? (default: 5): ', (count) => {
      const messageCount = parseInt(count) || 5;
      
      log(`Sending ${messageCount} messages...`, 'info');
      
      for (let i = 0; i < messageCount; i++) {
        setTimeout(() => {
          const message = `Stress test message ${i + 1} of ${messageCount}`;
          socket.emit('send_message', {
            receiverId: receiverId,
            content: message,
            type: 'text'
          });
          
          if (i === messageCount - 1) {
            log('Stress test completed!', 'success');
            setTimeout(showMenu, 1000);
          }
        }, i * 500); // 500ms delay between messages
      }
    });
  });
}

function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    log('Disconnected from server', 'info');
  }
  setTimeout(showMenu, 1000);
}

function exit() {
  if (socket) {
    socket.disconnect();
  }
  log('Goodbye!', 'success');
  rl.close();
  process.exit(0);
}

// Main function
function main() {
  console.log('🚀 Socket.IO Test Client');
  console.log('========================');
  console.log('Make sure the server is running on http://localhost:3000');
  console.log('');
  
  rl.question('Enter JWT token (Bearer token from login): ', (token) => {
    if (!token) {
      log('JWT token is required!', 'error');
      log('First register and login via REST API to get a token', 'info');
      exit();
      return;
    }
    
    connectSocket(token);
  });
}

// Handle process termination
process.on('SIGINT', exit);
process.on('SIGTERM', exit);

// Start the test client
main();
