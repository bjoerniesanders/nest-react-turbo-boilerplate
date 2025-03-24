import { EntityManager } from "@mikro-orm/core";
import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "../entities/user.entity";

@Injectable()
export class DelteUserService {
  constructor(private readonly em: EntityManager) {}

  async deleteUser(id: number): Promise<void> {
    const user = await this.em.findOne(User, { id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.em.removeAndFlush(user);
  }
}