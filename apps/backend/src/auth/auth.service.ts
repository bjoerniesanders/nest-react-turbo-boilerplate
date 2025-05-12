import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ReadUserService } from 'src/users/read/read-user.service';
import { Response as ExpressResponse } from 'express';
import { UserDto } from '@src/users/dto/user.dto';
import { AuthenticatedUser, JwtPayload } from './types/authenticated-user.type';
import { ConfigService } from '@nestjs/config';
import { AuthConfig, authConfig } from './config/auth.config';

@Injectable()
export class AuthService {
  private readonly config: AuthConfig;

  constructor(
    private readonly usersService: ReadUserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.config = authConfig();
  }

  async validateUser(email: string, password: string): Promise<AuthenticatedUser | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(
    user: UserDto,
    res: ExpressResponse,
  ): Promise<{ user: { id: number; email: string; roles: string[] } }> {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      roles: user.roles
        ? Array.isArray(user.roles)
          ? user.roles.filter(Boolean)
          : [user.roles]
        : [],
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.jwt.accessToken.secret,
      expiresIn: this.config.jwt.accessToken.expiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.jwt.refreshToken.secret,
      expiresIn: this.config.jwt.refreshToken.expiresIn,
    });

    res.cookie(this.config.cookies.accessToken.name, accessToken, {
      ...this.config.cookies.options,
      maxAge: this.config.cookies.accessToken.maxAge,
    });

    res.cookie(this.config.cookies.refreshToken.name, refreshToken, {
      ...this.config.cookies.options,
      maxAge: this.config.cookies.refreshToken.maxAge,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        roles: payload.roles,
      },
    };
  }

  async refreshTokenFromValue(refreshToken: string, res: ExpressResponse): Promise<void> {
    if (!refreshToken) throw new UnauthorizedException('No refresh token provided');

    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.config.jwt.refreshToken.secret,
      });

      const newAccessToken = this.jwtService.sign(payload, {
        secret: this.config.jwt.accessToken.secret,
        expiresIn: this.config.jwt.accessToken.expiresIn,
      });

      res.cookie(this.config.cookies.accessToken.name, newAccessToken, {
        ...this.config.cookies.options,
        maxAge: this.config.cookies.accessToken.maxAge,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new UnauthorizedException(`Invalid refresh token: ${error.message}`);
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
