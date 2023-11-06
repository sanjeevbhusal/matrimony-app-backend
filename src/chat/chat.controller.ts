import { Controller, Get, Param, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('/')
  getChats(@Query('userId') userId: string) {
    return this.chatService.getChats(userId);
  }
}
