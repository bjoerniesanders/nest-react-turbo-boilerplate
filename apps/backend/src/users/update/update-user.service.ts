import { EntityManager } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class UpdateUserService {
  constructor(private readonly em: EntityManager) {}

  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.em.findOne(User, { id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    Object.assign(user, updateData);
    await this.em.persistAndFlush(user);

    return user;
  }
}
