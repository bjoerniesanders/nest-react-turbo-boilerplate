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

    if (!requiredRoles) {
      return true; 
    }

    const request = context.switchToHttp().getRequest();
    console.log('Required Roles:', requiredRoles);
    console.log('Request User:', request.user);

    if (!request.user) {
      console.error('User not authenticated or missing from request object.');
      return false;
    }

    const userRoles = Array.isArray(request.user.roles) ? request.user.roles : [request.user.roles];
    console.log('User Roles:', userRoles);

    const hasRole = requiredRoles.some((role) => userRoles.includes(role));
    console.log('Has Required Role:', hasRole);

    return hasRole;
  }
}
