import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/updateUser.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(body, id);
  }
}
