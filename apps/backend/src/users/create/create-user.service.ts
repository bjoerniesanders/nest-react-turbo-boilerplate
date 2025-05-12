import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Roles } from '../userRoles.const';

@Injectable()
export class CreateUserService {
  constructor(private readonly em: EntityManager) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const allowedRoles: (keyof typeof Roles)[] = [Roles.USER];
    const filteredRoles = createUserDto.roles.filter((role) => allowedRoles.includes(role));
    if (filteredRoles.length === 0) {
      filteredRoles.push(Roles.USER);
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.em.create(User, {
      ...createUserDto,
      password: hashedPassword,
      roles: filteredRoles,
    });
    await this.em.persistAndFlush(user);
    return user;
  }

  async createAdmin(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.em.create(User, {
      ...createUserDto,
      password: hashedPassword,
      roles: createUserDto.roles,
    });
    await this.em.persistAndFlush(user);
    return user;
  }
}
