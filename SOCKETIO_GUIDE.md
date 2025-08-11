# 🚀 Socket.IO Server - Quick Start Guide

## 🏃‍♂️ How to Run the Socket.IO Server

### Method 1: Using npm scripts (Recommended)

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### Method 2: Direct execution

```bash
# Run directly with Node.js
node src/index.js

# Run with enhanced logging
node start-socketio.js
```

### Method 3: Using nodemon directly

```bash
npx nodemon src/index.js
```

## ✅ Verify Server is Running

When the server starts successfully, you should see:

```
🚀 Server is running on port 3000
📍 Environment: development
🔌 Socket.IO enabled
```

## 🧪 Test Socket.IO Connection

### Option 1: Use the Test Client

1. Start the server first
2. Open `socketio-test-client.html` in your browser
3. Get a JWT token by calling REST API endpoints first:

```bash
# Register a user
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login to get JWT token
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

4. Copy the JWT token from the login response
5. Paste it in the test client and click "Connect"

### Option 2: Browser Console Test

Open browser console and run:

```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'Bearer YOUR_JWT_TOKEN_HERE',
  },
});

socket.on('connect', () => {
  console.log('Connected to Socket.IO!');
});

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.IO');
});

// Test sending a message
socket.emit('send_message', {
  receiverId: 'USER_ID_HERE',
  content: 'Hello Socket.IO!',
  type: 'text',
});
```

## 🔧 Troubleshooting

### Server won't start

1. Check if port 3000 is available:

   ```bash
   lsof -i :3000
   ```

2. Check environment variables:

   ```bash
   cat .env
   ```

3. Verify MongoDB connection:
   - Make sure MongoDB is running
   - Check MONGODB_URI in .env

### Socket.IO connection fails

1. Verify JWT token is valid
2. Check CORS settings in socket configuration
3. Ensure authentication middleware is working

### Import/Export errors

1. Verify all dependencies are installed:

   ```bash
   npm install
   ```

2. Check Node.js version (requires 16+):
   ```bash
   node --version
   ```

## 📡 Socket.IO Features Available

### Messaging Events

- `send_message` - Send a message
- `new_message` - Receive a message
- `typing` - Start typing indicator
- `stop_typing` - Stop typing indicator

### Call Events

- `start_call` - Initiate a call
- `answer_call` - Answer incoming call
- `decline_call` - Decline incoming call
- `end_call` - End active call
- `incoming_call` - Receive call notification

### Status Events

- `user_status` - User online/offline status
- `message_delivered` - Message delivery confirmation
- `message_read` - Message read confirmation

## 🎯 Next Steps

1. **Start the server** using one of the methods above
2. **Test basic connection** using the HTML test client
3. **Register test users** via REST API
4. **Test real-time messaging** between users
5. **Test call functionality** with the Socket.IO events

## 📚 Files Reference

- `src/index.js` - Main server entry point
- `src/config/socket.js` - Socket.IO configuration
- `socketio-test-client.html` - Test client interface
- `start-socketio.js` - Enhanced server with logging
- `API_TESTING_GUIDE.js` - Complete API examples

---

**Socket.IO server is ready to run! 🚀**
