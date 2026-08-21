const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../../app');

let adminToken;

beforeAll(async () => {
  const res = await request(app).post('/api/auth/login').send({
    email: 'admin@eventpulse.com',
    password: 'admin123',
  });
  adminToken = res.body.token;
}, 30000);

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

describe('Events API', () => {
  it('GET /api/events should return 200 and an array', async () => {
    const res = await request(app).get('/api/events');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/events without token should return 401', async () => {
    const res = await request(app).post('/api/events').send({
      title: 'Test Event',
      description: 'Test',
      category: new mongoose.Types.ObjectId(),
      date: '2026-12-01',
      city: 'Cairo',
      venue: 'Test Venue',
      capacity: 100,
    });
    expect(res.status).toBe(401);
  });

  it('POST /api/events with invalid data should return 422', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});
    expect(res.status).toBe(422);
  });
});
