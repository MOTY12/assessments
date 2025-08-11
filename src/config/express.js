/* eslint-disable no-unused-vars */
import morgan from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import express from 'express';
import Routes from '../app/routes/index.js';
import envValidator from '../app/validations/env.js';
import { genericErrors, Helper } from '../app/utils/index.js';

const { errorResponse } = Helper;
const { notFoundApi } = genericErrors;

const { error } = envValidator();
if (error) {
    console.error(`Configuration validation error: ${error.message}`);
    // throw new Error(`Configuration validation error: ${error.message}`);
}

class AppConfig {
  constructor() {
    this.app = express();
    this.config();
  }

  config() {
    // Parse JSON bodies
    this.app.use(bodyParser.json({ limit: '10mb' }));
    this.app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
    
    // Enable CORS
    this.app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
      credentials: true,
    }));

    // Use helmet to secure Express headers
    this.app.use(helmet());
    this.app.disable('x-powered-by');

    // Logging middleware
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(morgan('combined'));
    }

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    });

    // API routes
    Routes.routes(this.app);

    // catch 404 and forward to error handler
    this.app.use((req, res, next) => next(notFoundApi));

    // error handlers
    this.app.use((err, req, res, next) => errorResponse(req, res, err));
  }
}

export default new AppConfig().app;
