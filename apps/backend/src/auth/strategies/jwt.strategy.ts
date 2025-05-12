import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload } from '../types/authenticated-user.type';

interface JwtUser {
  id: number;
  email: string;
  roles: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    const secretKey =
      typeof jwtSecret === 'string' && jwtSecret !== '' ? jwtSecret : 'fallback_secret';

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string | null => {
          if (
            request?.cookies !== undefined &&
            request.cookies !== null &&
            typeof request.cookies === 'object' &&
            'access_token' in request.cookies
          ) {
            const token = request.cookies.access_token;
            if (typeof token === 'string' && token !== '') {
              return token;
            }
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtUser> {
    return { id: payload.sub, email: payload.email, roles: payload.roles };
  }
}
