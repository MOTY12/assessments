# 🧪 Complete Socket.IO Test Data Package

## 🚀 Quick Start Commands

### 1. Start the Server

```bash
# Option 1: Development mode
npm run dev

# Option 2: Enhanced logging
node start-socketio.js

# Option 3: Direct start
node src/index.js
```

### 2. Setup Test Data (Automated)

```bash
# Run the automated setup script
node setup-test-data.js
```

### 3. Manual Test User Creation

#### Register Test Users

```bash
# Alice
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice@test.com",
    "password": "password123"
  }'

# Bob
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Bob",
    "lastName": "Smith",
    "email": "bob@test.com",
    "password": "password123"
  }'

# Charlie
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Charlie",
    "lastName": "Brown",
    "email": "charlie@test.com",
    "password": "password123"
  }'
```

#### Login to Get Tokens

```bash
# Login Alice
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@test.com",
    "password": "password123"
  }'

# Login Bob
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bob@test.com",
    "password": "password123"
  }'
```

**💡 Save the JWT tokens and user IDs from the responses!**

## 📱 Testing Options

### Option 1: HTML Test Client

1. Open `socketio-test-client.html` in browser
2. Enter JWT token from login response
3. Click "Connect to Socket.IO"
4. Test messaging and calls

### Option 2: Node.js Test Client

```bash
# Run interactive test client
node socketio-test-client.js
```

### Option 3: Browser Console

```javascript
// Connect to Socket.IO
const socket = io('http://localhost:3000', {
  auth: { token: 'Bearer YOUR_JWT_TOKEN_HERE' },
});

// Listen for events
socket.on('connect', () => console.log('Connected!'));
socket.on('new_message', data => console.log('Message:', data));

// Send test message
socket.emit('send_message', {
  receiverId: 'USER_ID_HERE',
  content: 'Hello Socket.IO!',
  type: 'text',
});
```

## 💬 Sample Message Test Data

### Basic Messages

```javascript
const testMessages = [
  {
    content: 'Hello! How are you today?',
    type: 'text',
  },
  {
    content: 'This is a test message from Socket.IO 🚀',
    type: 'text',
  },
  {
    content: 'Real-time messaging is working perfectly!',
    type: 'text',
  },
  {
    content: 'Can you see this message instantly? ⚡',
    type: 'text',
  },
  {
    content: 'Socket.IO testing is fun! 🎉',
    type: 'text',
  },
];
```

### Different Message Types

```javascript
// Text message
socket.emit('send_message', {
  receiverId: 'BOB_USER_ID',
  content: 'Hello Bob! This is a text message',
  type: 'text',
});

// Image message (simulated)
socket.emit('send_message', {
  receiverId: 'BOB_USER_ID',
  content: 'https://example.com/test-image.jpg',
  type: 'image',
});

// File message (simulated)
socket.emit('send_message', {
  receiverId: 'BOB_USER_ID',
  content: 'test-document.pdf',
  type: 'file',
});

// Audio message (simulated)
socket.emit('send_message', {
  receiverId: 'BOB_USER_ID',
  content: 'voice-note.mp3',
  type: 'audio',
});
```

## 📞 Call Test Scenarios

### Voice Call Test

```javascript
// Alice starts call to Bob
socket.emit('start_call', {
  receiverId: 'BOB_USER_ID',
  type: 'voice',
});

// Bob answers (use callId from incoming_call event)
socket.emit('answer_call', {
  callId: 'CALL_ID_FROM_EVENT',
});

// End call after testing
socket.emit('end_call', {
  callId: 'CALL_ID_FROM_EVENT',
  reason: 'completed',
});
```

### Video Call Test

```javascript
// Start video call
socket.emit('start_call', {
  receiverId: 'BOB_USER_ID',
  type: 'video',
});

// Decline call
socket.emit('decline_call', {
  callId: 'CALL_ID_FROM_EVENT',
});
```

## ⌨️ Typing Indicator Test

```javascript
// Start typing
socket.emit('typing', {
  receiverId: 'BOB_USER_ID',
});

// Stop typing after 3 seconds
setTimeout(() => {
  socket.emit('stop_typing', {
    receiverId: 'BOB_USER_ID',
  });
}, 3000);
```

## 🔄 Message Operations Test

```javascript
// Mark messages as read
socket.emit('mark_as_read', {
  senderId: 'BOB_USER_ID',
});

// Edit message (use actual message ID)
socket.emit('edit_message', {
  messageId: 'MESSAGE_ID_HERE',
  newContent: 'This is the edited message content',
});

// Delete message
socket.emit('delete_message', {
  messageId: 'MESSAGE_ID_HERE',
});
```

## 🧪 Stress Testing

### Multiple Messages

```javascript
// Send 10 messages rapidly
for (let i = 0; i < 10; i++) {
  setTimeout(() => {
    socket.emit('send_message', {
      receiverId: 'BOB_USER_ID',
      content: `Stress test message ${i + 1}/10`,
      type: 'text',
    });
  }, i * 200); // 200ms between messages
}
```

### Multiple Connections

1. Open multiple browser tabs
2. Connect different users in each tab
3. Test simultaneous messaging
4. Test multiple calls

## 📊 Event Monitoring

### Complete Event Listener Setup

```javascript
// Connection events
socket.on('connect', () => console.log('✅ Connected'));
socket.on('disconnect', reason => console.log('❌ Disconnected:', reason));
socket.on('connect_error', error => console.log('❌ Connection error:', error));

// Message events
socket.on('new_message', data => console.log('📨 New message:', data));
socket.on('message_sent', data => console.log('✅ Message sent:', data));
socket.on('message_delivered', data => console.log('📬 Delivered:', data));
socket.on('message_read', data => console.log('👁️ Read:', data));
socket.on('message_edited', data => console.log('✏️ Edited:', data));
socket.on('message_deleted', data => console.log('🗑️ Deleted:', data));
socket.on('user_typing', data => console.log('⌨️ Typing:', data));

// Call events
socket.on('incoming_call', data => console.log('📞 Incoming call:', data));
socket.on('call_started', data => console.log('📞 Call started:', data));
socket.on('call_answered', data => console.log('✅ Call answered:', data));
socket.on('call_declined', data => console.log('❌ Call declined:', data));
socket.on('call_ended', data => console.log('📵 Call ended:', data));

// Status events
socket.on('user_status', data => console.log('👤 User status:', data));

// Error events
socket.on('message_error', data => console.log('❌ Message error:', data));
socket.on('call_error', data => console.log('❌ Call error:', data));
```

## 🌐 REST API Testing (Backup)

### Send Message via REST

```bash
curl -X POST http://localhost:3000/api/messages/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "receiverId": "USER_ID_HERE",
    "content": "Hello from REST API!",
    "type": "text"
  }'
```

### Get Chat History

```bash
curl -X GET "http://localhost:3000/api/messages/chat/USER_ID_HERE?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Start Call via REST

```bash
curl -X POST http://localhost:3000/api/call/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "receiverId": "USER_ID_HERE",
    "type": "voice"
  }'
```

## 📋 Test Checklist

### Basic Functionality

- [ ] Server starts successfully
- [ ] Socket.IO connection works
- [ ] JWT authentication works
- [ ] Basic message sending/receiving
- [ ] Message types (text, image, file, audio)

### Real-time Features

- [ ] Typing indicators
- [ ] Message delivery status
- [ ] Message read receipts
- [ ] User presence (online/offline)

### Call Management

- [ ] Voice call initiation
- [ ] Video call initiation
- [ ] Call answer/decline/end
- [ ] Call history and stats

### Advanced Features

- [ ] Message editing/deletion
- [ ] Multiple simultaneous users
- [ ] Connection recovery
- [ ] Error handling

### Performance

- [ ] Multiple messages (stress test)
- [ ] Multiple connections
- [ ] Long-running connections
- [ ] Memory usage monitoring

## 🔧 Troubleshooting

### Server Issues

```bash
# Check if server is running
curl http://localhost:3000

# Check port availability
lsof -i :3000

# Check environment variables
cat .env
```

### Connection Issues

1. Verify JWT token is valid
2. Check CORS settings
3. Ensure authentication middleware works
4. Check browser console for errors

### Database Issues

1. Verify MongoDB connection
2. Check database permissions
3. Monitor database logs

## 📁 File Reference

- `start-socketio.js` - Enhanced server with logging
- `setup-test-data.js` - Automated test user creation
- `socketio-test-client.js` - Node.js interactive test client
- `socketio-test-client.html` - Browser-based test interface
- `SOCKETIO_TEST_DATA.md` - This comprehensive guide

---

**Your Socket.IO server is ready for comprehensive testing! 🚀**

Start with the automated setup script, then use any of the test clients to validate all features. The system supports real-time messaging, voice/video calls, typing indicators, user presence, and more!
