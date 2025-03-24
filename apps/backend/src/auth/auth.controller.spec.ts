import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ReadUserService } from 'src/users/read/read-user.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;
  let mockResponse: Partial<Response>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    roles: ['user'],
  };

  beforeEach(async () => {
    // Mock Response erstellen
    mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Partial<Response>;

    // Mock JwtService erstellen
    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    // Mock ReadUserService erstellen
    const mockReadUserService = {
      findByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ReadUserService,
          useValue: mockReadUserService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);

    // Mock JWT Token
    const mockAccessToken = 'mock.access.token';
    const mockRefreshToken = 'mock.refresh.token';
    jest.spyOn(jwtService, 'sign')
      .mockReturnValueOnce(mockAccessToken)
      .mockReturnValueOnce(mockRefreshToken);
  });

  describe('login', () => {
    it('sollte erfolgreich einloggen und beide Token als Cookies setzen', async () => {
      const mockRequest = {
        user: mockUser,
      };

      const result = await controller.login(mockRequest as any, mockResponse as Response);

      // Überprüfe, ob beide Cookies gesetzt wurden
      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
      
      // Überprüfe Access Token Cookie
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        expect.any(String),
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          maxAge: 60 * 60 * 1000, // 1 Stunde
        })
      );

      // Überprüfe Refresh Token Cookie
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refresh_token',
        expect.any(String),
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Tage
        })
      );

      // Überprüfe Response
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          roles: mockUser.roles,
        },
      });
    });
  });

  describe('refresh', () => {
    it('sollte erfolgreich einen neuen Access Token generieren', async () => {
      const mockRefreshToken = 'valid.refresh.token';
      const mockNewAccessToken = 'new.access.token';

      // Mock JWT Verify
      jest.spyOn(jwtService, 'verify').mockReturnValue(mockUser);
      // Mock JWT Sign für neuen Access Token
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockNewAccessToken);

      const result = await controller.refresh(mockRefreshToken, mockResponse as Response);

      // Überprüfe, ob ein neuer Access Token Cookie gesetzt wurde
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        mockNewAccessToken,
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          maxAge: 60 * 60 * 1000, // 1 Stunde
        })
      );

      expect(result).toEqual({ message: 'Token refreshed successfully' });
    });

    it('sollte einen Fehler werfen, wenn kein Refresh Token vorhanden ist', async () => {
      await expect(controller.refresh('', mockResponse as Response))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('sollte einen Fehler werfen, wenn der Refresh Token ungültig ist', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(controller.refresh('invalid.token', mockResponse as Response))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('sollte beide Token-Cookies löschen', async () => {
      const result = await controller.logout(mockResponse as Response);

      // Überprüfe, ob beide Cookies gelöscht wurden
      expect(mockResponse.clearCookie).toHaveBeenCalledTimes(2);
      
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        'access_token',
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
        })
      );

      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        'refresh_token',
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
        })
      );

      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });
});
