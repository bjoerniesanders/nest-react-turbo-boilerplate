import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ReadUserService } from 'src/users/read/read-user.service';
import { Response as ExpressResponse } from 'express';
import { UserDto } from '@src/users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: ReadUserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserDto, res: ExpressResponse) {
    const payload = {
      email: user.email,
      sub: user.id,
      roles: Array.isArray(user.roles) ? user.roles : [user.roles],
    };

    const accessToken = this.jwtService.sign(payload); 
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 1000, // 1 Stunde
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Tage
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
      const payload = this.jwtService.verify(refreshToken);
      const newAccessToken = this.jwtService.sign({
        email: payload.email,
        sub: payload.sub,
        roles: payload.roles,
      });

      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 1000, // 1 Stunde
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
