/**
 * Assessment API - Messaging and Calls Feature Demo
 * 
 * This file contains example requests to test the messaging and call endpoints.
 * Make sure to start the server with: npm run dev
 * 
 * Features implemented:
 * 1. Real-time messaging with Socket.IO
 * 2. REST endpoints for message management
 * 3. Call management system (voice/video)
 * 4. WebSocket events for real-time communication
 * 5. Message history and conversation management
 * 6. Call history and statistics
 */

// ================================
// AUTHENTICATION (Required for all endpoints)
// ================================

/*
POST /api/register
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john@example.com",
  "password": "password123"
}

POST /api/login
{
  "email": "john@example.com",
  "password": "password123"
}
*/

// ================================
// MESSAGING ENDPOINTS
// ================================

/*
1. Send a message (REST endpoint)
POST /api/messages/send
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "receiverId": "507f1f77bcf86cd799439011",
  "content": "Hello! How are you?",
  "type": "text"
}

2. Get chat history with a specific user
GET /api/messages/chat/507f1f77bcf86cd799439011?page=1&limit=20
Headers: Authorization: Bearer <JWT_TOKEN>

3. Mark messages as read
PUT /api/messages/read
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "senderId": "507f1f77bcf86cd799439011",
  "messageIds": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"]
}

4. Get unread message count
GET /api/messages/unread
Headers: Authorization: Bearer <JWT_TOKEN>

5. Edit a message
PUT /api/messages/507f1f77bcf86cd799439012
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "content": "Updated message content"
}

6. Delete a message
DELETE /api/messages/507f1f77bcf86cd799439012
Headers: Authorization: Bearer <JWT_TOKEN>

7. Get recent conversations
GET /api/messages/conversations?limit=10
Headers: Authorization: Bearer <JWT_TOKEN>
*/

// ================================
// CALL ENDPOINTS
// ================================

/*
1. Start a call
POST /api/call/start
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "receiverId": "507f1f77bcf86cd799439011",
  "type": "voice"
}

2. End a call
POST /api/call/end
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "callId": "507f1f77bcf86cd799439020",
  "reason": "completed"
}

3. Answer a call
POST /api/call/answer
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "callId": "507f1f77bcf86cd799439020"
}

4. Decline a call
POST /api/call/decline
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "callId": "507f1f77bcf86cd799439020"
}

5. Get call history
GET /api/call/history?page=1&limit=20&type=voice&status=ended
Headers: Authorization: Bearer <JWT_TOKEN>

6. Get active call
GET /api/call/active
Headers: Authorization: Bearer <JWT_TOKEN>

7. Get call statistics
GET /api/call/stats
Headers: Authorization: Bearer <JWT_TOKEN>
*/

// ================================
// SOCKET.IO EVENTS (Real-time)
// ================================

/*
Client-side Socket.IO connection:

const socket = io('http://localhost:3000', {
  auth: {
    token: 'Bearer <JWT_TOKEN>'
  }
});

// Listen for connection
socket.on('connect', () => {
  console.log('Connected to server');
});

// Join user to their personal room
socket.emit('join_user_room', { userId: 'your_user_id' });

// Send a message
socket.emit('send_message', {
  receiverId: '507f1f77bcf86cd799439011',
  content: 'Hello via Socket.IO!',
  type: 'text'
});

// Listen for new messages
socket.on('new_message', (data) => {
  console.log('New message received:', data);
});

// Listen for message status updates
socket.on('message_delivered', (data) => {
  console.log('Message delivered:', data);
});

socket.on('message_read', (data) => {
  console.log('Message read:', data);
});

// Typing indicators
socket.emit('typing_start', { receiverId: '507f1f77bcf86cd799439011' });
socket.emit('typing_stop', { receiverId: '507f1f77bcf86cd799439011' });

socket.on('user_typing', (data) => {
  console.log('User is typing:', data);
});

// Call events
socket.emit('start_call', {
  receiverId: '507f1f77bcf86cd799439011',
  type: 'voice'
});

socket.on('incoming_call', (data) => {
  console.log('Incoming call:', data);
});

socket.emit('answer_call', { callId: 'call_id_here' });
socket.emit('decline_call', { callId: 'call_id_here' });
socket.emit('end_call', { callId: 'call_id_here' });

socket.on('call_answered', (data) => {
  console.log('Call answered:', data);
});

socket.on('call_ended', (data) => {
  console.log('Call ended:', data);
});

// User presence
socket.on('user_online', (data) => {
  console.log('User came online:', data);
});

socket.on('user_offline', (data) => {
  console.log('User went offline:', data);
});
*/

// ================================
// WALLET ENDPOINTS (Previously implemented)
// ================================

/*
1. Create wallet
POST /api/wallet/create
Headers: Authorization: Bearer <JWT_TOKEN>

2. Get wallet details
GET /api/wallet
Headers: Authorization: Bearer <JWT_TOKEN>

3. Add funds
POST /api/wallet/add-funds
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "amount": 100.50,
  "currency": "USD"
}

4. Transfer funds
POST /api/wallet/transfer
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "recipientId": "507f1f77bcf86cd799439011",
  "amount": 50.00,
  "currency": "USD"
}

5. Get transaction history
GET /api/wallet/transactions?page=1&limit=20
Headers: Authorization: Bearer <JWT_TOKEN>
*/

export default {
  message: "Assessment API with Messaging, Calls, and Wallet features is ready!",
  endpoints: {
    messaging: 8,
    calls: 7,
    wallet: 5,
    authentication: 2
  },
  features: [
    "Real-time messaging with Socket.IO",
    "REST API fallback for messaging",
    "Call management (voice/video)",
    "Message history and conversations",
    "Call history and statistics", 
    "User presence and typing indicators",
    "Wallet integration with OnePipe (mocked)",
    "JWT authentication",
    "MongoDB data persistence"
  ]
};
