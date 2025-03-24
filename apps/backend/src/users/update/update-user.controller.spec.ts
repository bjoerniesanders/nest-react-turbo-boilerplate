import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserController } from './update-user.controller';
import { UpdateUserService } from './update-user.service';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('UpdateUserController', () => {
  let controller: UpdateUserController;
  let service: UpdateUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateUserController],
      providers: [UpdateUserService],
    }).compile();

    controller = module.get<UpdateUserController>(UpdateUserController);
    service = module.get<UpdateUserService>(UpdateUserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
}); 