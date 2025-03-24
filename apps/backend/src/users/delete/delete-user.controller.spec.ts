import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserController } from './delete-user.controller';
import { DelteUserService } from './delete-user.service';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('DeleteUserController', () => {
  let controller: DeleteUserController;
  let service: DelteUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteUserController],
      providers: [DelteUserService],
    }).compile();

    controller = module.get<DeleteUserController>(DeleteUserController);
    service = module.get<DelteUserService>(DelteUserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
}); 