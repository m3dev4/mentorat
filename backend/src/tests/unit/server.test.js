import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';

// Mocker le module de configuration
jest.mock('../../../src/config/env/env.config.js', () => ({
  envConfig: {
    NODE_ENV: 'test',
    PORT: 3000,
  },
}));

describe('Server', () => {
  let app;

  beforeAll(async () => {
    // Importer le serveur après avoir configuré les mocks
    const serverModule = await import('../../../src/server.js');
    app = serverModule.default || express();
  });

  test('GET / devrait retourner "Hello World!"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World!');
  });
});
