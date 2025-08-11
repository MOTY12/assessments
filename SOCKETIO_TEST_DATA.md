# 🧪 Socket.IO Test Data & Scenarios

## 📋 Test Users Data

### User 1 (Sender)

```json
{
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice@test.com",
  "password": "password123"
}
```

### User 2 (Receiver)

```json
{
  "firstName": "Bob",
  "lastName": "Smith",
  "email": "bob@test.com",
  "password": "password123"
}
```

### User 3 (Group Testing)

```json
{
  "firstName": "Charlie",
  "lastName": "Brown",
  "email": "charlie@test.com",
  "password": "password123"
}
```

## 🚀 Step-by-Step Testing Guide

### 1. Register Test Users (REST API)

```bash
# Register Alice
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice@test.com",
    "password": "password123"
  }'

# Register Bob
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Bob",
    "lastName": "Smith",
    "email": "bob@test.com",
    "password": "password123"
  }'

# Register Charlie
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Charlie",
    "lastName": "Brown",
    "email": "charlie@test.com",
    "password": "password123"
  }'
```

### 2. Login to Get JWT Tokens

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

**Save the JWT tokens and user IDs from the responses!**

### 3. Get All Users (to get User IDs)

```bash
# Get all users (use Alice's token)
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer ALICE_JWT_TOKEN"
```

## 💬 Messaging Test Scenarios

### Scenario 1: Basic Message Exchange

```javascript
// Alice sends message to Bob
socket.emit('send_message', {
  receiverId: 'BOB_USER_ID',
  content: 'Hello Bob! How are you today?',
  type: 'text',
});
```

### Scenario 2: Different Message Types

```javascript
// Text message
socket.emit('send_message', {
  receiverId: 'BOB_USER_ID',
  content: 'This is a text message',
  type: 'text',
});

// Image message (simulated)
socket.emit('send_message', {
  receiverId: 'BOB_USER_ID',
  content: 'https://example.com/image.jpg',
  type: 'image',
});

// File message (simulated)
socket.emit('send_message', {
  receiverId: 'BOB_USER_ID',
  content: 'document.pdf',
  type: 'file',
});

// Audio message (simulated)
socket.emit('send_message', {
  receiverId: 'BOB_USER_ID',
  content: 'voice_note.mp3',
  type: 'audio',
});
```

### Scenario 3: Typing Indicators

```javascript
// Start typing
socket.emit('typing', {
  receiverId: 'BOB_USER_ID',
});

// After 3 seconds, stop typing
setTimeout(() => {
  socket.emit('stop_typing', {
    receiverId: 'BOB_USER_ID',
  });
}, 3000);
```

### Scenario 4: Message Operations

```javascript
// Mark messages as read
socket.emit('mark_as_read', {
  senderId: 'BOB_USER_ID',
});

// Edit a message (use message ID from previous response)
socket.emit('edit_message', {
  messageId: 'MESSAGE_ID_HERE',
  newContent: 'This is the edited message content',
});

// Delete a message
socket.emit('delete_message', {
  messageId: 'MESSAGE_ID_HERE',
});
```

## 📞 Call Test Scenarios

### Scenario 1: Voice Call Flow

```javascript
// Alice starts a voice call to Bob
socket.emit('start_call', {
  receiverId: 'BOB_USER_ID',
  type: 'voice',
});

// Bob answers the call (use callId from incoming_call event)
socket.emit('answer_call', {
  callId: 'CALL_ID_FROM_EVENT',
});

// End the call after testing
socket.emit('end_call', {
  callId: 'CALL_ID_FROM_EVENT',
  reason: 'completed',
});
```

### Scenario 2: Video Call Flow

```javascript
// Alice starts a video call to Bob
socket.emit('start_call', {
  receiverId: 'BOB_USER_ID',
  type: 'video',
});

// Bob declines the call
socket.emit('decline_call', {
  callId: 'CALL_ID_FROM_EVENT',
});
```

### Scenario 3: Call Management

```javascript
// Start multiple calls to test call queue
socket.emit('start_call', {
  receiverId: 'BOB_USER_ID',
  type: 'voice',
});

socket.emit('start_call', {
  receiverId: 'CHARLIE_USER_ID',
  type: 'video',
});
```

## 📊 Test Data Samples

### Sample User IDs (after registration)

```javascript
const testUsers = {
  alice: '507f1f77bcf86cd799439011',
  bob: '507f1f77bcf86cd799439012',
  charlie: '507f1f77bcf86cd799439013',
};
```

### Sample Message Conversations

```javascript
const sampleMessages = [
  {
    receiverId: 'BOB_USER_ID',
    content: 'Hey Bob! Ready for the meeting?',
    type: 'text',
  },
  {
    receiverId: 'BOB_USER_ID',
    content: "Let me know when you're available",
    type: 'text',
  },
  {
    receiverId: 'CHARLIE_USER_ID',
    content: "Hi Charlie, how's the project going?",
    type: 'text',
  },
  {
    receiverId: 'CHARLIE_USER_ID',
    content: 'Can we schedule a call later?',
    type: 'text',
  },
];

// Send all sample messages
sampleMessages.forEach((msg, index) => {
  setTimeout(() => {
    socket.emit('send_message', msg);
  }, index * 1000); // 1 second delay between messages
});
```

### Sample Call Tests

```javascript
const callTests = [
  {
    receiverId: 'BOB_USER_ID',
    type: 'voice',
    action: 'answer',
    duration: 30000, // 30 seconds
  },
  {
    receiverId: 'CHARLIE_USER_ID',
    type: 'video',
    action: 'decline',
    duration: 0,
  },
  {
    receiverId: 'BOB_USER_ID',
    type: 'voice',
    action: 'timeout',
    duration: 45000, // 45 seconds
  },
];
```

## 🔍 Event Monitoring

### Listen for All Events

```javascript
// Connection events
socket.on('connect', () => console.log('✅ Connected'));
socket.on('disconnect', () => console.log('❌ Disconnected'));

// Message events
socket.on('new_message', data => console.log('📨 New message:', data));
socket.on('message_sent', data => console.log('✅ Message sent:', data));
socket.on('message_delivered', data =>
  console.log('📬 Message delivered:', data)
);
socket.on('message_read', data => console.log('👁️ Message read:', data));
socket.on('user_typing', data => console.log('⌨️ User typing:', data));

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

## 🧪 Advanced Test Scenarios

### Multi-User Conversation

1. Open 3 browser tabs
2. Connect Alice, Bob, and Charlie in different tabs
3. Start a group conversation
4. Test message delivery to multiple users

### Call Interruption Test

1. Alice calls Bob
2. While call is ringing, Charlie calls Alice
3. Test call queue and busy status

### Connection Reliability Test

1. Connect and disconnect multiple times
2. Send messages during reconnection
3. Test message queue and delivery

### Load Testing

```javascript
// Send multiple messages rapidly
for (let i = 0; i < 10; i++) {
  socket.emit('send_message', {
    receiverId: 'BOB_USER_ID',
    content: `Message number ${i + 1}`,
    type: 'text',
  });
}
```

## 📱 Mobile Simulation Test

```javascript
// Simulate mobile app behavior
const mobileSocket = io('http://localhost:3000', {
  auth: { token: 'Bearer YOUR_TOKEN' },
  transports: ['websocket'], // Force websocket
  upgrade: true,
  rememberUpgrade: true,
});

// Test background/foreground simulation
setTimeout(() => {
  mobileSocket.disconnect(); // Simulate app backgrounded
}, 5000);

setTimeout(() => {
  mobileSocket.connect(); // Simulate app foregrounded
}, 10000);
```

## ✅ Test Checklist

- [ ] User registration and login
- [ ] Socket.IO connection with JWT
- [ ] Basic message sending/receiving
- [ ] Message types (text, image, file, audio)
- [ ] Typing indicators
- [ ] Message read receipts
- [ ] Voice call initiation
- [ ] Video call initiation
- [ ] Call answer/decline/end
- [ ] Multiple simultaneous calls
- [ ] User presence (online/offline)
- [ ] Connection recovery
- [ ] Error handling
- [ ] Message history via REST API
- [ ] Call history via REST API

Use this comprehensive test data to thoroughly validate your Socket.IO implementation! 🚀
