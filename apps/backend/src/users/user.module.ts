import { Module } from '@nestjs/common';
import { CreateUserController } from './create/create-user.controller';
import { CreateUserService } from './create/create-user.service';
import { ReadUserController } from './read/read-user.controller';
import { ReadUserService } from './read/read-user.service';
import { UpdateUserController } from './update/update-user.controller';
import { UpdateUserService } from './update/update-user.service';
import { DeleteUserController } from './delete/delete-user.controller';
import { DelteUserService } from './delete/delete-user.service';


@Module({
  controllers: [
    CreateUserController,
    ReadUserController,
    UpdateUserController,
    DeleteUserController
  ],
  providers: [
    CreateUserService,
    ReadUserService,
    UpdateUserService,
    DelteUserService
  ],
  exports: [ReadUserService],
})
export class UsersModule {}
