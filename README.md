# Assessment API

A RESTful API built with Node.js, Express, and following modern best practices for enterprise applications.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with refresh tokens
- **Input Validation**: Comprehensive request validation using express-validator
- **Security**: Helmet for security headers, CORS configuration, password hashing
- **Error Handling**: Centralized error handling with custom error classes
- **Logging**: Winston logger with file and console transports
- **Testing**: Jest testing framework with coverage reports
- **Code Quality**: ESLint and Prettier for code formatting and quality
- **Documentation**: Well-structured and documented codebase

## 📁 Project Structure

```
src/
├── app/
│   ├── controllers/        # Request handlers
│   ├── middlewares/        # Custom middleware functions
│   ├── models/            # Data models
│   ├── routes/            # Route definitions
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   └── validations/       # Input validation rules
├── config/                # Configuration files
└── index.js              # Application entry point
tests/                     # Test files
logs/                      # Application logs
```

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/MOTY12/assessments.git
   cd assessments
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your configuration:

   ```env
   NODE_ENV=development
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-that-should-be-at-least-32-characters-long
   JWT_EXPIRES_IN=15m
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🏃‍♂️ Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run build` - Build the project with Babel
- `npm run serve` - Serve the built project

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Users

- `GET /api/v1/users` - Get all users (protected)
- `PUT /api/v1/users/:id` - Update user (protected)
- `GET /api/v1/users/profile` - Get current user profile (protected)

### Wallet (OnePipe Integration)

- `POST /api/v1/wallet/create` - Create wallet for user (protected)
- `GET /api/v1/wallet/balance` - Get wallet balance (protected)
- `GET /api/v1/wallet/details` - Get wallet details (protected)
- `POST /api/v1/wallet/fund` - Fund wallet (protected)
- `POST /api/v1/wallet/transfer` - Transfer funds (protected)
- `GET /api/v1/wallet/transactions` - Get transaction history (protected)

### System

- `GET /health` - Health check endpoint
- `GET /` - API information

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 Request/Response Examples

### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🔧 Environment Variables

| Variable          | Description                               | Default     |
| ----------------- | ----------------------------------------- | ----------- |
| `NODE_ENV`        | Environment (development/production/test) | development |
| `PORT`            | Server port                               | 3000        |
| `JWT_SECRET`      | JWT signing secret (required)             | -           |
| `JWT_EXPIRES_IN`  | JWT expiration time                       | 15m         |
| `ALLOWED_ORIGINS` | CORS allowed origins                      | \*          |
| `LOG_LEVEL`       | Logging level                             | info        |

## 🏗️ Architecture Patterns

This project follows several architectural patterns and best practices:

- **MVC Pattern**: Separation of concerns with Models, Views (API responses), and Controllers
- **Service Layer**: Business logic separated into service classes
- **Middleware Pattern**: Reusable middleware for authentication, validation, etc.
- **Repository Pattern**: Data access abstraction (ready for database integration)
- **Error Handling**: Centralized error handling with custom error classes
- **Configuration Management**: Environment-based configuration

## 🔄 Development Workflow

1. **Feature Development**
   - Create feature branch
   - Write tests first (TDD approach)
   - Implement feature
   - Run tests and linting
   - Submit pull request

2. **Code Quality**
   - ESLint for code quality
   - Prettier for code formatting
   - Jest for testing
   - Pre-commit hooks (recommended)

## 🚀 Deployment

The application is ready for deployment on various platforms:

- **Docker**: Containerization ready
- **Heroku**: Environment variable support
- **AWS/GCP/Azure**: Cloud platform ready
- **PM2**: Process management for production

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

## 📞 Support

If you have any questions or need help, please open an issue in the GitHub repository.
