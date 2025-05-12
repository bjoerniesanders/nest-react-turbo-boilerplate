import { Controller, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { UpdateUserService } from './update-user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from '../entities/user.entity';

@Controller('users')
export class UpdateUserController {
  constructor(private readonly updateUserService: UpdateUserService) {}

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(@Param('id') id: number, @Body() updateData: Partial<User>): Promise<User> {
    return this.updateUserService.updateUser(id, updateData);
  }
}
