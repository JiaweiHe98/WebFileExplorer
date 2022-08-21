const supertest = require('supertest');
const app = require('../app');

describe('Test default uir with empty project', () => {
  it('browsering the default route', async () => {
    const res = await supertest(app)
      .get('/')
      .expect(200);
    expect(res.text).toBe('OK');
  });
});
