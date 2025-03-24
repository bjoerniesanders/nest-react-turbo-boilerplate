import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ReadUserService } from './read-user.service';
import { UserDto } from '../dto/user.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class ReadUserController {
  constructor(private readonly readUserService: ReadUserService) {}
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('allUser')
  async getAllUsers(): Promise<UserDto[]> {
    return this.readUserService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return this.readUserService.findById(id);
  }
}
