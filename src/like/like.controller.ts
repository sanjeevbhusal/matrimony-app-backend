import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { Auth } from 'src/common/decorators/routes/auth.decorator';
import { User as UserEntity } from 'src/common/decorators/params/user.decorator';
import { User } from '@prisma/client';

@Controller('like')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post('/')
  @Auth()
  createLike(@UserEntity() user: User, @Body() body: any) {
    return this.likeService.createLike(user.id, body.userId);
  }

  @Get('/')
  @Auth()
  getLike(@UserEntity() user: User, @Query('userId') userId: string) {
    console.log(user.id, userId);
    return this.likeService.getLike(user.id, userId);
  }

  @Delete('/:id')
  @Auth()
  deleteLike(@Param('id') id: string) {
    return this.likeService.deleteLike(id);
  }
}
