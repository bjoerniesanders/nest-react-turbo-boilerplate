import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserController } from './delete-user.controller';
import { DelteUserService } from './delete-user.service';
import { EntityManager } from '@mikro-orm/core';
import { User } from '@src/users/entities/user.entity';
import { Roles } from '@src/users/userRoles.const';
import { NotFoundException } from '@nestjs/common';

describe('DeleteUserController', () => {
  let controller: DeleteUserController;
  // let service: DelteUserService;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    roles: [Roles.USER],
    password: 'hashedPassword123',
  };

  const mockEntityManager = {
    findOne: jest.fn(),
    removeAndFlush: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteUserController],
      providers: [
        DelteUserService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    controller = module.get<DeleteUserController>(DeleteUserController);
    // service = module.get<DelteUserService>(DelteUserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deleteUser', () => {
    it('should successfully delete a user', async () => {
      mockEntityManager.findOne.mockResolvedValue(mockUser);
      const result = await controller.deleteUser(1);

      expect(result).toEqual({ message: 'User with id 1 has been deleted' });
      expect(mockEntityManager.findOne).toHaveBeenCalledWith(User, { id: 1 });
      expect(mockEntityManager.removeAndFlush).toHaveBeenCalledWith(mockUser);
    });

    it('should throw an error when user is not found', async () => {
      mockEntityManager.findOne.mockResolvedValue(null);
      await expect(controller.deleteUser(999)).rejects.toThrow(NotFoundException);
    });
  });
});
