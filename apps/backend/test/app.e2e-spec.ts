import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/app (GET)', () => {
    return request(app.getHttpServer())
      .get('/app')
      .expect(200)
      .expect('Hello World!');
  });
});

describe('Auth (e2e)', () => {
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

  describe('Authentication', () => {
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('/auth/login (POST) - should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(testUser)
        .expect(401);
    });

    it('/auth/refresh (POST) - should fail without refresh token', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .expect(401);
    });

    it('/auth/logout (POST) - should succeed even without being logged in', () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual({ message: 'Logged out successfully' });
          const cookieHeaders = Array.isArray(res.headers['set-cookie']) 
            ? res.headers['set-cookie'] 
            : [res.headers['set-cookie']].filter(Boolean);
          expect(cookieHeaders.length).toBe(2);
          expect(cookieHeaders.some((h: string) => h.includes('access_token=;'))).toBe(true);
          expect(cookieHeaders.some((h: string) => h.includes('refresh_token=;'))).toBe(true);
        });
    });
  });
});
