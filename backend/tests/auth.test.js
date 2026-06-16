const request = require('supertest');
const app = require('../app');

describe('POST /auth/validate', () => {
  it('returns a token for a valid apiKey', async () => {
    const res = await request(app)
      .post('/auth/validate')
      .send({ apiKey: process.env.API_KEY });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('rejects a missing apiKey', async () => {
    const res = await request(app).post('/auth/validate').send({});
    expect(res.status).toBe(400);
  });

  it('rejects an invalid apiKey', async () => {
    const res = await request(app)
      .post('/auth/validate')
      .send({ apiKey: 'wrong-key' });

    expect(res.status).toBe(401);
  });
});
