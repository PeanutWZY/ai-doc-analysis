import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should support token-based operations', async () => {
    // 1. Register and Login to get token
    const unique = Date.now();
    const email = `test${unique}@example.com`;
    const username = `user${unique}`;
    const password = 'password123';

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, username, password })
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ name: email, password })
      .expect(201);

    const loginBody = loginRes.body as {
      code: number;
      message: string;
      data: { token: string };
    };
    const token = loginBody.data.token;
    expect(token).toBeDefined();

    // 2. Get Profile
    const profileRes = await request(app.getHttpServer())
      .get('/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const profileBody = profileRes.body as {
      code: number;
      message: string;
      data: { username: string; email: string };
    };
    expect(profileBody.data.username).toBe(username);
    expect(profileBody.data.email).toBe(email);

    // 3. Update user without userId in body
    const newUsername = `new${unique}`;
    const updateRes = await request(app.getHttpServer())
      .post('/user/update')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: newUsername,
      })
      .expect(201);

    const updateBody = updateRes.body as { code: number; message: string };
    expect(updateBody.code).toBe(0);

    // 4. Verify logs without userId in query
    const logsRes = await request(app.getHttpServer())
      .get('/user/logs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const logsBody = logsRes.body as {
      code: number;
      message: string;
      data: Array<{ newValue: string | null }>;
    };
    expect(logsBody.code).toBe(0);
    expect(logsBody.data).toHaveLength(1);
    expect(logsBody.data[0].newValue).toBe(newUsername);
  });
});
