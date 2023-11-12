import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get('/')
  async getMessages(@Query('chatId') chatId: string) {
    return this.messageService.getMessages(chatId);
  }

  @Post('/')
  async postMessage(@Body() body: any) {
    return this.messageService.postMessage(body);
  }
}
