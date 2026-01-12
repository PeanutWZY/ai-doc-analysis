import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
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

    const token = loginRes.body.data.token;
    expect(token).toBeDefined();

    // 2. Get Profile
    const profileRes = await request(app.getHttpServer())
      .get('/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(profileRes.body.data.username).toBe(username);
    expect(profileRes.body.data.email).toBe(email);

    // 3. Update user without userId in body
    const newUsername = `new${unique}`;
    const updateRes = await request(app.getHttpServer())
      .post('/user/update')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: newUsername,
      })
      .expect(201);

    expect(updateRes.body.code).toBe(0);

    // 4. Verify logs without userId in query
    const logsRes = await request(app.getHttpServer())
      .get('/user/logs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(logsRes.body.code).toBe(0);
    expect(logsRes.body.data).toHaveLength(1);
    expect(logsRes.body.data[0].newValue).toBe(newUsername);
  });
});
