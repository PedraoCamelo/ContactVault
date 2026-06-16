jest.mock('../lib/rabbitmq', () => ({ publish: jest.fn().mockResolvedValue() }));

const request = require('supertest');
const express = require('express');
const { publish } = require('../lib/rabbitmq');
const loggerMiddleware = require('../middleware/logger');

function buildApp() {
  const app = express();
  app.use(loggerMiddleware);
  app.get('/ping', (req, res) => res.json({ ok: true }));
  return app;
}

describe('loggerMiddleware', () => {
  afterEach(() => jest.clearAllMocks());

  it('publishes request metadata when LOGGER is ON', async () => {
    process.env.LOGGER = 'ON';
    const app = buildApp();

    await request(app).get('/ping');
    await new Promise((resolve) => setImmediate(resolve));

    expect(publish).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'GET', path: '/ping', status: 200 })
    );
  });

  it('does not publish when LOGGER is OFF', async () => {
    process.env.LOGGER = 'OFF';
    const app = buildApp();

    await request(app).get('/ping');

    expect(publish).not.toHaveBeenCalled();
  });
});
