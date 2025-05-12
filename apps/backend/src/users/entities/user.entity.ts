import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Roles, RolesType } from '../userRoles.const';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  username!: string;

  @Property({ hidden: true })
  password!: string;

  @Property({ unique: true, nullable: true })
  email!: string;

  @Property({ type: 'json' })
  roles: RolesType[] = [Roles.USER];

  @Property({ nullable: true })
  surname?: string;

  @Property({ nullable: true })
  lastname?: string;
}
