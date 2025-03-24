import { Controller, Delete, Param } from "@nestjs/common";
import { DelteUserService } from "./delete-user.service";

@Controller('users')
export class DeleteUserController {
  constructor(private readonly deleteUserService: DelteUserService) {}

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    await this.deleteUserService.deleteUser(id);
    return { message: `User with id ${id} has been deleted` };
  }
}