import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ReadUserService } from '@src/users/read/read-user.service';
import { Response, Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { Roles } from '@src/users/userRoles.const';
import { ConfigService } from '@nestjs/config';
import { User } from '@src/users/entities/user.entity';
import { AuthenticatedUser } from './types/authenticated-user.type';

interface AuthenticatedRequest extends Request {
  user: User;
}

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    roles: [Roles.USER],
    username: 'testuser',
  };

  beforeEach(async () => {
    mockRequest = {
      cookies: {},
      user: mockUser,
    };

    mockResponse = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: ReadUserService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'JWT_SECRET':
                  return 'test_secret';
                case 'JWT_REFRESH_SECRET':
                  return 'test_refresh_secret';
                default:
                  return undefined;
              }
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);

    const mockAccessToken = 'mock.access.token';
    const mockRefreshToken = 'mock.refresh.token';
    jest
      .spyOn(jwtService, 'sign')
      .mockReturnValueOnce(mockAccessToken)
      .mockReturnValueOnce(mockRefreshToken);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should successfully login and set both tokens as cookies', async () => {
      const authenticatedUser: AuthenticatedUser = {
        id: mockUser.id,
        email: mockUser.email,
        roles: mockUser.roles,
      };

      jest.spyOn(authService, 'login').mockResolvedValue({ user: authenticatedUser });

      const result = await controller.login(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(result).toEqual({ user: authenticatedUser });
      expect(authService.login).toHaveBeenCalledWith(mockUser, mockResponse);
    });
  });

  describe('refresh', () => {
    it('should successfully generate a new access token', async () => {
      const refreshToken = 'valid.refresh.token';
      mockRequest.cookies = { refresh_token: refreshToken };

      jest.spyOn(authService, 'refreshTokenFromValue').mockResolvedValue();

      await controller.refresh(refreshToken, mockResponse as Response);

      expect(authService.refreshTokenFromValue).toHaveBeenCalledWith(refreshToken, mockResponse);
    });

    it('should throw an error when no refresh token is present', async () => {
      await expect(controller.refresh('', mockResponse as Response)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw an error when refresh token is invalid', async () => {
      const invalidToken = 'invalid.refresh.token';

      jest
        .spyOn(authService, 'refreshTokenFromValue')
        .mockRejectedValue(new UnauthorizedException('Invalid refresh token'));

      await expect(controller.refresh(invalidToken, mockResponse as Response)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('should clear both token cookies', async () => {
      await controller.logout(mockResponse as Response);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        'access_token',
        expect.objectContaining({
          httpOnly: true,
          path: '/',
          sameSite: 'strict',
          secure: false,
        }),
      );
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        'refresh_token',
        expect.objectContaining({
          httpOnly: true,
          path: '/',
          sameSite: 'strict',
          secure: false,
        }),
      );
    });
  });
});
