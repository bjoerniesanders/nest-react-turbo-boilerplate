import { Test, TestingModule } from '@nestjs/testing';
import { MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { beforeAll, afterAll } from '@jest/globals';
import { ConfigModule } from '@nestjs/config';

let app: INestApplication;
let orm: MikroORM;

export const getApp = () => app;
export const getOrm = () => orm;

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env.test',
      }),
      AppModule,
    ],
  }).compile();

  app = moduleFixture.createNestApplication();
  orm = app.get(MikroORM);
  await app.init();
});

afterAll(async () => {
  if (orm) {
    await orm.close();
  }
  if (app) {
    await app.close();
  }
});


