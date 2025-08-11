import Joi from 'joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number()
    .positive()
    .default(3000),
  JWT_SECRET: Joi.string()
    .min(32)
    .required()
    .messages({
      'any.required': 'JWT_SECRET is required',
      'string.min': 'JWT_SECRET must be at least 32 characters long'
    }),
  JWT_EXPIRES_IN: Joi.string()
    .default('7d'),
  MONGODB_URI: Joi.string()
    .uri()
    .required()
    .messages({
      'any.required': 'MONGODB_URI is required for database connection',
      'string.uri': 'MONGODB_URI must be a valid URI'
    }),
  ALLOWED_ORIGINS: Joi.string()
    .optional()
    .description('Comma-separated list of allowed origins for CORS'),
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info'),
  
  // OnePipe Configuration (Optional for mocking)
  ONEPIPE_BASE_URL: Joi.string()
    .uri()
    .default('https://api.onepipe.io/v1'),
  ONEPIPE_API_KEY: Joi.string()
    .default('mock-api-key')
    .description('OnePipe API key (mocked by default)'),
  ONEPIPE_SECRET_KEY: Joi.string()
    .default('mock-secret-key')
    .description('OnePipe secret key (mocked by default)'),
  ONEPIPE_BANK_CODE: Joi.string()
    .default('ONEPIPE'),
}).unknown(true);

const envValidator = () => {
  const { error, value } = envSchema.validate(process.env);
  
  if (error) {
    return { error };
  }
  
  return { value };
};

export default envValidator;
