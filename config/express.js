/* eslint-disable no-unused-vars */
import morgan from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import express from 'express';
import Routes from '../app/routes/index';
import envValidator from '../app/validations/env';
import { genericErrors, Helper } from '../app/utils';

const { errorResponse } = Helper;
const { notFoundApi } = genericErrors;

const { error } = envValidator();
if (error) {
  throw new Error(`Configuration validation error: ${error.message}`);
}

class AppConfig {
  constructor() {
    this.app = express();
    this.config();
  }

  config() {

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors());

    // Use helmet to secure Express headers
    this.app.use(helmet());
    this.app.disable('x-powered-by');

    this.app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept');
      res.setHeader('Access-Control-Allow-Credentials', true);
      next();
    });

    Routes.routes(this.app);

    // catch 404 and forward to error handler
    this.app.use((req, res, next) => next(notFoundApi));

    // error handlers
    this.app.use((err, req, res, next) => errorResponse(req, res, err));
  }
}
export default new AppConfig().app;
