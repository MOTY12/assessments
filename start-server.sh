#!/bin/bash

echo "🚀 Starting Assessment API Socket.IO Server"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this from the project root directory."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Using defaults."
fi

# Check if MongoDB is accessible
echo "🔍 Checking MongoDB connection..."
if [ -n "$MONGODB_URI" ]; then
    echo "✅ MongoDB URI found in environment"
else
    echo "⚠️  MongoDB URI not set, will use default"
fi

# Kill any existing node processes on port 3000
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "No processes to kill"

# Start the server
echo "🚀 Starting server..."
echo "📍 Server will be available at: http://localhost:3000"
echo "🔌 Socket.IO will be available at: ws://localhost:3000"
echo "📄 Test client: Open socketio-test-client.html in browser"
echo ""
echo "⏳ Starting server now..."

# Try multiple ways to start the server
if [ -f "start-socketio.js" ]; then
    echo "Using enhanced server script..."
    node start-socketio.js
elif [ -f "src/index.js" ]; then
    echo "Using main server script..."
    node src/index.js
else
    echo "❌ No server script found!"
    exit 1
fi
