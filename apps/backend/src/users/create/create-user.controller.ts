import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateUserService } from './create-user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';


@Controller('users')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.createUserService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('create-admin')  
  async createAdmin(@Body() createUserDto: CreateUserDto) {
    return await this.createUserService.createAdmin(createUserDto);
  }
}
