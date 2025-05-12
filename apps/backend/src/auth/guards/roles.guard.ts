import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../roles/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles === undefined || requiredRoles === null || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    if (request.user === undefined || request.user === null) {
      console.error('User not authenticated or missing from request object.');
      return false;
    }

    const userRoles = Array.isArray(request.user.roles) ? request.user.roles : [request.user.roles];

    const hasRole = requiredRoles.some((role) => userRoles.includes(role) === true);

    return hasRole;
  }
}
