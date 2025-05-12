import { beforeAll, afterAll } from 'vitest';
import { TestingModule, Test } from '@nestjs/testing';

import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';

let app: INestApplication;

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.use(cookieParser());
  await app.init();
});

afterAll(async () => {
  if (app) {
    await app.close();
  }
});

export { app };


