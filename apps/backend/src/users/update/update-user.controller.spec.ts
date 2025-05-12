import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserController } from './update-user.controller';
import { UpdateUserService } from './update-user.service';
import { EntityManager } from '@mikro-orm/core';
import { UpdateUserDto } from '@src/users/dto/update-user.dto';
import { User } from '@src/users/entities/user.entity';
import { Roles } from '@src/users/userRoles.const';
import { NotFoundException } from '@nestjs/common';

describe('UpdateUserController', () => {
  let controller: UpdateUserController;
  let _service: UpdateUserService;
  let mockEntityManager: Partial<EntityManager>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    roles: [Roles.USER],
    password: 'hashedPassword123',
  };

  const updateUserDto: UpdateUserDto = {
    username: 'updateduser',
    email: 'updated@example.com',
    roles: [Roles.USER],
  };

  beforeEach(async () => {
    mockEntityManager = {
      findOne: jest.fn().mockResolvedValue(mockUser),
      persistAndFlush: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateUserController],
      providers: [
        UpdateUserService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    controller = module.get<UpdateUserController>(UpdateUserController);
    _service = module.get<UpdateUserService>(UpdateUserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updatedUser = { ...mockUser, ...updateUserDto };
      const result = await controller.updateUser(1, updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(mockEntityManager.findOne).toHaveBeenCalled();
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user is not found', async () => {
      jest.spyOn(mockEntityManager, 'findOne').mockResolvedValueOnce(null);
      await expect(controller.updateUser(999, updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });
});
