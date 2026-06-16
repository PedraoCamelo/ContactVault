const request = require('supertest');
const app = require('../app');

async function getToken() {
  const res = await request(app)
    .post('/auth/validate')
    .send({ apiKey: process.env.API_KEY });
  return res.body.token;
}

describe('/contacts', () => {
  it('rejects requests without a token', async () => {
    const res = await request(app).get('/contacts');
    expect(res.status).toBe(401);
  });

  it('rejects requests with an invalid token', async () => {
    const res = await request(app)
      .get('/contacts')
      .set('Authorization', 'Bearer not-a-real-token');

    expect(res.status).toBe(401);
  });

  it('creates, reads, updates and deletes a contact', async () => {
    const token = await getToken();
    const auth = { Authorization: `Bearer ${token}` };

    const createRes = await request(app)
      .post('/contacts')
      .set(auth)
      .send({ firstName: 'João', lastName: 'Silva', email: 'joao@example.com' });

    expect(createRes.status).toBe(201);
    const id = createRes.body._id;

    const listRes = await request(app).get('/contacts').set(auth);
    expect(listRes.status).toBe(200);
    expect(listRes.body).toHaveLength(1);

    const getRes = await request(app).get(`/contacts/${id}`).set(auth);
    expect(getRes.status).toBe(200);
    expect(getRes.body.email).toBe('joao@example.com');

    const updateRes = await request(app)
      .put(`/contacts/${id}`)
      .set(auth)
      .send({ firstName: 'João', lastName: 'Souza', email: 'joao@example.com' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.lastName).toBe('Souza');

    const deleteRes = await request(app).delete(`/contacts/${id}`).set(auth);
    expect(deleteRes.status).toBe(200);

    const getAfterDelete = await request(app).get(`/contacts/${id}`).set(auth);
    expect(getAfterDelete.status).toBe(404);
  });

  it('returns 400 when required fields are missing', async () => {
    const token = await getToken();
    const res = await request(app)
      .post('/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'Incompleto' });

    expect(res.status).toBe(400);
  });

  it('returns 404 for a non-existent contact id', async () => {
    const token = await getToken();
    const res = await request(app)
      .get('/contacts/64a1f2c3e4b0a1b2c3d4e5f6')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
