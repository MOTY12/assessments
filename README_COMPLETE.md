# Assessment API - Complete Communication Platform

A comprehensive RESTful API built with Node.js, Express, MongoDB, and Socket.IO featuring real-time messaging, call management, wallet integration, and modern authentication system.

## 🚀 Key Features

### Authentication & Security

- **JWT Authentication**: Secure token-based authentication
- **Password Security**: Bcrypt password hashing
- **Security Headers**: Helmet middleware for security
- **CORS**: Cross-origin resource sharing configuration

### Real-time Communication

- **Socket.IO Messaging**: Real-time bidirectional messaging
- **Typing Indicators**: Live typing status updates
- **User Presence**: Online/offline status tracking
- **Message Status**: Delivered and read receipts

### Call Management

- **Voice/Video Calls**: Call initiation and management
- **Call History**: Complete call logs with duration tracking
- **Call Statistics**: Comprehensive calling analytics
- **Call States**: Answer, decline, end call functionality

### Wallet Integration

- **OnePipe Integration**: Financial transaction processing (mocked)
- **Balance Management**: Wallet creation and balance tracking
- **Transaction History**: Complete transaction logs
- **Fund Transfer**: Peer-to-peer money transfers

### Data & Storage

- **MongoDB**: NoSQL database with Mongoose ODM
- **Data Validation**: Joi schema validation
- **Error Handling**: Centralized error management
- **Logging**: Winston logger with file and console outputs

## 📁 Project Architecture

```
src/
├── app/
│   ├── controllers/        # Request handlers
│   │   ├── UserController.js       # User management
│   │   ├── MessageController.js    # Message operations
│   │   ├── CallController.js       # Call management
│   │   └── WalletController.js     # Wallet operations
│   ├── models/            # Mongoose schemas
│   │   ├── User.js                 # User data model
│   │   ├── Message.js              # Message schema
│   │   ├── Call.js                 # Call records
│   │   └── Wallet.js               # Wallet schema
│   ├── services/          # Business logic
│   │   ├── UserService.js          # User operations
│   │   ├── MessageService.js       # Message handling
│   │   ├── CallService.js          # Call management
│   │   ├── WalletService.js        # Wallet operations
│   │   ├── AuthService.js          # Authentication
│   │   └── OnePipeService.js       # External API (mocked)
│   ├── routes/            # API routes
│   │   ├── userRoutes.js           # User endpoints
│   │   ├── messageRoutes.js        # Message endpoints
│   │   ├── callRoutes.js           # Call endpoints
│   │   ├── walletRoutes.js         # Wallet endpoints
│   │   └── authRoutes.js           # Auth endpoints
│   ├── validations/       # Input validation
│   │   ├── userValidation.js       # User input rules
│   │   ├── messageValidation.js    # Message validation
│   │   ├── callValidation.js       # Call validation
│   │   └── walletValidation.js     # Wallet validation
│   ├── middleware/        # Custom middleware
│   └── utils/             # Utility functions
├── config/                # Configuration
│   ├── express.js                  # Express setup
│   ├── database.js                 # MongoDB connection
│   └── socket.js                   # Socket.IO configuration
└── index.js              # Application entry point
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/MOTY12/assessments.git
   cd assessments
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your configurations:

   ```env
   NODE_ENV=development
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=24h
   MONGODB_URI=mongodb://localhost:27017/assessment
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the application**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📋 API Endpoints

### Authentication

```
POST /api/register          # User registration
POST /api/login             # User login
```

### User Management

```
GET  /api/users             # Get all users
PUT  /api/users/:id         # Update user
GET  /api/profile           # Get user profile
PUT  /api/profile           # Update profile
```

### Messaging (REST)

```
GET  /api/messages/chat/:userId     # Get chat history
POST /api/messages/send             # Send message
PUT  /api/messages/read             # Mark as read
GET  /api/messages/unread           # Unread count
PUT  /api/messages/:messageId       # Edit message
DELETE /api/messages/:messageId     # Delete message
GET  /api/messages/conversations    # Recent conversations
```

### Call Management

```
POST /api/call/start        # Start call
POST /api/call/end          # End call
POST /api/call/answer       # Answer call
POST /api/call/decline      # Decline call
GET  /api/call/history      # Call history
GET  /api/call/active       # Active call
GET  /api/call/stats        # Call statistics
```

### Wallet Operations

```
POST /api/wallet/create     # Create wallet
GET  /api/wallet            # Get wallet details
POST /api/wallet/add-funds  # Add funds
POST /api/wallet/transfer   # Transfer funds
GET  /api/wallet/transactions # Transaction history
```

## 🔌 Socket.IO Events

### Client Events (Emit)

```javascript
// Connection
socket.emit('join_user_room', { userId });

// Messaging
socket.emit('send_message', { receiverId, content, type });
socket.emit('typing_start', { receiverId });
socket.emit('typing_stop', { receiverId });

// Calls
socket.emit('start_call', { receiverId, type });
socket.emit('answer_call', { callId });
socket.emit('decline_call', { callId });
socket.emit('end_call', { callId });
```

### Server Events (Listen)

```javascript
// Messaging
socket.on('new_message', data);
socket.on('message_delivered', data);
socket.on('message_read', data);
socket.on('user_typing', data);

// Calls
socket.on('incoming_call', data);
socket.on('call_answered', data);
socket.on('call_declined', data);
socket.on('call_ended', data);

// Presence
socket.on('user_online', data);
socket.on('user_offline', data);
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📝 Development Scripts

```bash
npm run dev          # Start development server
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
```

## 🗃️ Database Models

### User Schema

- Personal information (name, email)
- Authentication data (password hash)
- Timestamps and status

### Message Schema

- Sender and receiver references
- Content and message type
- Read status and timestamps
- Message editing history

### Call Schema

- Participants and call type
- Duration and status tracking
- Start/end timestamps
- Call quality metrics

### Wallet Schema

- OnePipe integration
- Balance and currency
- Transaction history
- Security features

## 🔒 Security Features

- **JWT Authentication**: Stateless authentication
- **Password Hashing**: Bcrypt with salt rounds
- **Input Validation**: Joi schema validation
- **Security Headers**: Helmet middleware
- **CORS Configuration**: Cross-origin protection
- **Error Sanitization**: Safe error responses

## 🚀 Deployment

### Environment Variables

Ensure all required environment variables are set:

- `JWT_SECRET`: Strong secret for JWT signing
- `MONGODB_URI`: MongoDB connection string
- `CLIENT_URL`: Frontend application URL

### Production Considerations

- Use process managers (PM2, Forever)
- Set up reverse proxy (Nginx)
- Configure SSL/TLS certificates
- Enable MongoDB authentication
- Set up logging and monitoring

## 📚 API Testing

See `API_TESTING_GUIDE.js` for comprehensive examples of:

- Authentication flow
- Message operations
- Call management
- Wallet transactions
- Socket.IO events

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions:

- Create an issue in the repository
- Check the API testing guide
- Review the Socket.IO event documentation

---

**Built with ❤️ using Node.js, Express, MongoDB, and Socket.IO**
