# 🔧 Socket.IO Connection Error Troubleshooting

## Problem: "xhr poll error" when connecting to Socket.IO

The error you're seeing indicates that the Socket.IO server is not running or not accessible. Here's how to fix it:

## 🚀 Step 1: Start the Server

Open a new terminal in the project directory and run ONE of these commands:

### Option 1: Development mode (recommended)

```bash
npm run dev
```

### Option 2: Direct start

```bash
node src/index.js
```

### Option 3: Enhanced logging

```bash
node start-socketio.js
```

### Option 4: Using the startup script

```bash
./start-server.sh
```

## ✅ Step 2: Verify Server is Running

You should see output like this:

```
🚀 Server is running on port 3000
📍 Environment: development
🔌 Socket.IO enabled
```

## 🧪 Step 3: Test Server Connection

In another terminal, run:

```bash
curl http://localhost:3000
```

You should get a JSON response with:

```json
{
  "success": true,
  "message": "Welcome to Assessment API"
}
```

## 🔌 Step 4: Test Socket.IO Connection

1. **Make sure the server is running** (see step 1)
2. **Get a JWT token first** by registering/logging in
3. **Then try connecting** in the HTML test client

### Quick User Setup:

```bash
# Register a test user
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

Copy the `token` from the login response.

## 🌐 Step 5: Connect in Browser

1. Open `socketio-test-client.html` in your browser
2. Paste the JWT token
3. Click "Connect to Socket.IO"
4. You should see "✅ Connected to Socket.IO server"

## 🔍 Common Issues & Solutions

### Issue 1: Port 3000 is already in use

```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process (replace PID with actual process ID)
kill -9 PID
```

### Issue 2: MongoDB connection issues

Make sure your `.env` file has:

```env
MONGODB_URI=mongodb+srv://dev:aCeHr1234@acehr.phurqzy.mongodb.net/assessments?retryWrites=true&w=majority&appName=Acehr
```

### Issue 3: Missing dependencies

```bash
npm install
```

### Issue 4: Environment variables not loaded

Check your `.env` file exists and has:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=moty1jkmilkmj-secure-secret-key-at-least-32-characters-long-for-development
```

## 🧪 Alternative Testing Methods

### Method 1: Automated Test Setup

```bash
node setup-test-data.js
```

### Method 2: Node.js Test Client

```bash
node socketio-test-client.js
```

### Method 3: Browser Console

```javascript
const socket = io('http://localhost:3000', {
  auth: { token: 'Bearer YOUR_JWT_TOKEN' },
});

socket.on('connect', () => console.log('Connected!'));
socket.on('connect_error', error => console.log('Error:', error));
```

## 📋 Checklist

- [ ] Server is running (npm run dev or node src/index.js)
- [ ] Port 3000 is accessible (curl http://localhost:3000)
- [ ] JWT token is obtained (POST /api/login)
- [ ] Token is entered in test client
- [ ] Browser console shows no CORS errors
- [ ] MongoDB connection is working

## 🆘 Still Having Issues?

1. **Check the terminal where you started the server** - look for error messages
2. **Check browser console** (F12) for additional error details
3. **Verify environment variables** are loaded correctly
4. **Try a different port** by changing PORT in .env to 3001
5. **Restart your browser** to clear any cached connections

## 🎯 Quick Test Once Server is Running

```bash
# 1. Register user
curl -X POST http://localhost:3000/api/register -H "Content-Type: application/json" -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"password123"}'

# 2. Login user
curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'

# 3. Use the token in Socket.IO test client
```

The Socket.IO server should work perfectly once these steps are completed! 🚀
