import { Test, TestingModule } from '@nestjs/testing';
import { ReadUserController } from './read-user.controller';
import { ReadUserService } from './read-user.service';
import { EntityManager } from '@mikro-orm/core';
import { UserDto } from '../dto/user.dto';
import { Roles } from '../userRoles.const';
import { NotFoundException } from '@nestjs/common';
import { User } from '../entities/user.entity';

describe('ReadUserController', () => {
  let controller: ReadUserController;
  let _service: ReadUserService;

  const mockUser: UserDto = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    roles: [Roles.USER],
  };

  const mockEntityManager = {
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReadUserController],
      providers: [
        ReadUserService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    controller = module.get<ReadUserController>(ReadUserController);
    _service = module.get<ReadUserService>(ReadUserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      mockEntityManager.find.mockResolvedValue([mockUser]);

      const result = await controller.getAllUsers();

      expect(result).toEqual([mockUser]);
      expect(mockEntityManager.find).toHaveBeenCalledWith(User, {});
    });
  });

  describe('getUserById', () => {
    it('should return a single user', async () => {
      mockEntityManager.findOne.mockResolvedValue(mockUser);

      const result = await controller.getUserById(1);

      expect(result).toEqual(mockUser);
      expect(mockEntityManager.findOne).toHaveBeenCalledWith(User, { id: 1 });
    });

    it('should throw an error if the user is not found', async () => {
      mockEntityManager.findOne.mockResolvedValue(null);

      await expect(controller.getUserById(999)).rejects.toThrow(NotFoundException);
      expect(mockEntityManager.findOne).toHaveBeenCalledWith(User, { id: 999 });
    });
  });
});
