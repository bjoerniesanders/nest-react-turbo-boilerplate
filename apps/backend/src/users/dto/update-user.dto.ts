import { IsOptional, IsString, IsArray, IsEmail } from 'class-validator';

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
  roles?: string[];

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsString()
  lastname?: string;
}
