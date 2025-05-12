import { Roles } from '@src/users/userRoles.const';

export interface AuthenticatedUser {
  id: number;
  email: string;
  roles: (typeof Roles)[keyof typeof Roles][];
}

export interface JwtPayload {
  sub: number;
  email: string;
  roles: (typeof Roles)[keyof typeof Roles][];
}
