import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { User } from '../entities/user.entity';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class ReadUserService {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<UserDto[]> {
    const users = await this.em.find(User, {});
    return users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
    }));
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.em.findOne(User, { email });
  }
  
  async findById(id: number): Promise<UserDto> {
    const user = await this.em.findOne(User, { id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
    };
  }
}