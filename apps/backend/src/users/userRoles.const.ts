export const Roles = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export type RolesType = (typeof Roles)[keyof typeof Roles];
