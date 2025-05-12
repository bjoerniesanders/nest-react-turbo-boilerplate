import { IsOptional, IsString, IsArray, IsEmail, IsEnum } from 'class-validator';
import { Roles, RolesType } from '../userRoles.const';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(Roles, { each: true })
  roles?: RolesType[];

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsString()
  lastname?: string;
}
