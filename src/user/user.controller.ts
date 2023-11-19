import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { User } from 'src/common/decorators/params/user.decorator';
import { User as UserEntity } from '@prisma/client';
import { Auth } from 'src/common/decorators/routes/auth.decorator';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(body, id);
  }

  @Get('/')
  @Auth()
  getUsers(@User() user: UserEntity, @Query('all') all: string) {
    console.log(all);
    return this.userService.getUsers(user, all);
  }

  @Get('/:id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }
}
