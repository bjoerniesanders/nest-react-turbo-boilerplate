import { IsArray, IsEmail, IsEnum, IsString, IsUUID } from 'class-validator';
import { Roles, RolesType } from '../userRoles.const';

export class UserDto {
  @IsUUID()
  id: number;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsArray()
  @IsEnum(Roles, { each: true })
  roles?: RolesType[];
}
