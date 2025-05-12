import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { method } = request;

    const publicRoutes = [
      { path: '/users', method: 'POST' },
      { path: '/auth/login', method: 'POST' },
    ];

    if (publicRoutes.some((route) => route.path === request.path && route.method === method)) {
      return true;
    }

    const result = super.canActivate(context);

    return result as boolean;
  }
}
