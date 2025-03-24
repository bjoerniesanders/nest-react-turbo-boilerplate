import { IsString, IsArray, IsEnum, IsEmail } from 'class-validator';
import { Roles } from '../userRoles.const';

export class CreateUserDto {
  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsEmail()
  email: string;

  @IsArray()
  @IsEnum(Roles, { each: true })
  roles: (keyof typeof Roles)[] = [Roles.USER];
}
