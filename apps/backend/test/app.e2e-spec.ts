import 'reflect-metadata'
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { describe, beforeAll, afterAll, it} from '@jest/globals';
import { MikroORM } from '@mikro-orm/core';
import { getApp, getOrm } from './setup';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let orm: MikroORM;

  beforeAll(async () => {
    app = getApp();
    orm = getOrm();
  });

  afterAll(async () => {
    if (orm) {
      await orm.close();
    }
    if (app) {
      await app.close();
    }
  });

  it('/app (GET)', () => {
    return request(app.getHttpServer())
      .get('/app')
      .expect(200)
      .expect('Hello World!');
  });
});
