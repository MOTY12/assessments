import mongoose from 'mongoose';
import { logger } from '../app/utils/index.js';

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/assessment_db';
    
    mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection;

    db.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
      process.exit(1);
    });

    db.once('open', () => {
      logger.info(`🗄️  Connected to MongoDB: ${mongoUri}`);
    });

    db.on('disconnected', () => {
      logger.warn('📴 MongoDB disconnected');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await db.close();
      logger.info('📴 MongoDB connection closed through app termination');
      process.exit(0);
    });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

export default Database;
