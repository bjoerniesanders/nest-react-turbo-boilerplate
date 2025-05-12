import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserController } from './create-user.controller';
import { CreateUserService } from './create-user.service';
import { Roles } from '@src/users/userRoles.const';
import { User } from '@src/users/entities/user.entity';
import { CreateUserDto } from '@src/users/dto/create-user.dto';

describe('CreateUserController', () => {
  let controller: CreateUserController;
  let service: CreateUserService;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    roles: [Roles.USER],
    password: 'hashedPassword123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateUserController],
      providers: [
        {
          provide: CreateUserService,
          useValue: {
            create: jest.fn(),
            createAdmin: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CreateUserController>(CreateUserController);
    service = module.get<CreateUserService>(CreateUserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        roles: [Roles.USER],
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockUser);

      const result = await controller.register(createUserDto);

      expect(result).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('createAdmin', () => {
    it('should create a new admin user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'admin@example.com',
        password: 'admin123',
        username: 'adminuser',
        roles: [Roles.ADMIN],
      };

      const adminUser: User = { ...mockUser, roles: [Roles.ADMIN] };
      jest.spyOn(service, 'createAdmin').mockResolvedValue(adminUser);

      const result = await controller.createAdmin(createUserDto);

      expect(result).toEqual(adminUser);
      expect(service.createAdmin).toHaveBeenCalledWith(createUserDto);
    });
  });
});
