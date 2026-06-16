const request = require('supertest');
const app = require('../app');
const Log = require('../models/Log');

async function getToken() {
  const res = await request(app)
    .post('/auth/validate')
    .send({ apiKey: process.env.API_KEY });
  return res.body.token;
}

describe('GET /logs', () => {
  it('rejects requests without a token', async () => {
    const res = await request(app).get('/logs');
    expect(res.status).toBe(401);
  });

  it('returns logs ordered by most recent', async () => {
    await Log.create({ method: 'GET', path: '/contacts', status: 200, durationMs: 5 });
    await Log.create({ method: 'POST', path: '/contacts', status: 201, durationMs: 10 });

    const token = await getToken();
    const res = await request(app)
      .get('/logs')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].method).toBe('POST');
  });
});
