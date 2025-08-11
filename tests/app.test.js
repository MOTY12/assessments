import request from 'supertest';
import app from '../src/config/express.js';

describe('Health Check Endpoint', () => {
  test('GET /health should return 200', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('environment');
  });
});

describe('Root Endpoint', () => {
  test('GET / should return welcome message', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Welcome to Assessment API');
    expect(response.body).toHaveProperty('version', '1.0.0');
  });
});

describe('404 Handler', () => {
  test('Should return 404 for non-existent endpoint', async () => {
    const response = await request(app)
      .get('/non-existent-endpoint')
      .expect(404);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'API endpoint not found');
  });
});
