import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ReadUserService } from '@src/users/read/read-user.service';
import { Roles } from '@src/users/userRoles.const';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { User } from '@src/users/entities/user.entity';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

jest.mock('./config/auth.config', () => ({
  authConfig: jest.fn().mockReturnValue({
    jwt: {
      accessToken: {
        secret: 'test_secret',
        expiresIn: '1h',
      },
      refreshToken: {
        secret: 'test_refresh_secret',
        expiresIn: '7d',
      },
    },
    cookies: {
      accessToken: {
        name: 'access_token',
        maxAge: 3600000,
      },
      refreshToken: {
        name: 'refresh_token',
        maxAge: 604800000,
      },
      options: {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/',
      },
    },
  }),
}));

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let readUserService: ReadUserService;
  // let configService: ConfigService;
  let mockResponse: Partial<Response>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedPassword',
    roles: [Roles.USER],
  };

  beforeEach(async () => {
    mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Partial<Response>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ReadUserService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    readUserService = module.get<ReadUserService>(ReadUserService);
    // configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate a user and return without password', async () => {
      jest.spyOn(readUserService, 'findByEmail').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password123');

      const { password: _password, ...expectedUser } = mockUser;
      expect(result).toEqual(expectedUser);
      expect(readUserService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    });

    it('should return null when user is not found', async () => {
      jest.spyOn(readUserService, 'findByEmail').mockResolvedValue(null);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toBeNull();
      expect(readUserService.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should return null when password does not match', async () => {
      jest.spyOn(readUserService, 'findByEmail').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
      expect(readUserService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
    });
  });

  describe('login', () => {
    it('should generate an access token and a refresh token', async () => {
      const mockAccessToken = 'mock_access_token';
      const mockRefreshToken = 'mock_refresh_token';

      jest.spyOn(jwtService, 'sign').mockImplementation((payload, options) => {
        if (options?.secret === 'test_secret') {
          return mockAccessToken;
        }
        if (options?.secret === 'test_refresh_secret') {
          return mockRefreshToken;
        }
        return '';
      });

      const result = await service.login(mockUser, mockResponse as Response);

      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          roles: mockUser.roles,
        },
      });

      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        mockAccessToken,
        expect.objectContaining({
          httpOnly: true,
          maxAge: 3600000,
          path: '/',
          sameSite: 'strict',
          secure: false,
        }),
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refresh_token',
        mockRefreshToken,
        expect.objectContaining({
          httpOnly: true,
          maxAge: 604800000,
          path: '/',
          sameSite: 'strict',
          secure: false,
        }),
      );
    });
  });

  describe('refreshTokenFromValue', () => {
    it('should generate a new access token', async () => {
      const mockRefreshToken = 'mock_refresh_token';
      const mockNewAccessToken = 'mock_new_access_token';
      const mockPayload = {
        sub: mockUser.id,
        email: mockUser.email,
        roles: mockUser.roles,
      };

      jest.spyOn(jwtService, 'verify').mockReturnValue(mockPayload);
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockNewAccessToken);

      await service.refreshTokenFromValue(mockRefreshToken, mockResponse as Response);

      expect(jwtService.verify).toHaveBeenCalledWith(mockRefreshToken, {
        secret: 'test_refresh_secret',
      });
      expect(jwtService.sign).toHaveBeenCalledWith(mockPayload, {
        secret: 'test_secret',
        expiresIn: '1h',
      });
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        mockNewAccessToken,
        expect.objectContaining({
          httpOnly: true,
          maxAge: 3600000,
          path: '/',
          sameSite: 'strict',
          secure: false,
        }),
      );
    });
  });
});
