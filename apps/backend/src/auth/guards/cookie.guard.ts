import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class CookieGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('cookeguard', context);
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.refresh_token;
    console.log(token);

    if (token === undefined || token === null || token === '')
      throw new UnauthorizedException('No refresh token');

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
