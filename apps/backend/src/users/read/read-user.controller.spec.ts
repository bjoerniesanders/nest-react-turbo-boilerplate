import { Test, TestingModule } from '@nestjs/testing';
import { ReadUserController } from './read-user.controller';
import { ReadUserService } from './read-user.service';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('ReadUserController', () => {
  let controller: ReadUserController;
  let service: ReadUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReadUserController],
      providers: [ReadUserService],
    }).compile();

    controller = module.get<ReadUserController>(ReadUserController);
    service = module.get<ReadUserService>(ReadUserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
}); 