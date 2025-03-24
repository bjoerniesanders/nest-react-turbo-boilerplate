import { Controller, HttpCode, HttpStatus, Post, Request, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { User } from 'src/users/entities/user.entity';
import { CookieGuard } from './guards/cookie.guard';
import { Cookies } from '@src/common/decorators/cookies.decorator';

interface AuthenticatedRequest extends ExpressRequest {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: AuthenticatedRequest, @Res({ passthrough: true }) res: ExpressResponse) {
    return this.authService.login(req.user, res);
  }

  @UseGuards(CookieGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Cookies('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }
    
    try {
      await this.authService.refreshTokenFromValue(refreshToken, res);
      return { message: 'Token refreshed successfully' };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: ExpressResponse) {
    // Lösche beide Token-Cookies
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return { message: 'Logged out successfully' };
  }
}
