import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Auth } from 'src/common/decorators/routes/auth.decorator';
import { User as UserEntity } from 'src/common/decorators/params/user.decorator';
import { User } from '@prisma/client';

@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('/')
  @Auth()
  getChats(@UserEntity() user: User) {
    return this.chatService.getChats(user.id);
  }

  @Post('/')
  @Auth()
  createChat(@UserEntity() user: User, @Body() body: any) {
    return this.chatService.createChat(user.id, body);
  }
}
