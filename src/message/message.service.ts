import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async getMessages(chatId: string) {
    console.log(chatId);
    const messages = await this.prisma.message.findMany({
      where: {
        chatId: chatId,
      },
    });
    console.log(messages);
    return messages;
  }

  async postMessage(body: any) {
    console.log(body);
    const message = await this.prisma.message.create({
      data: {
        ...(body as any),
      },
    });

    return message;
  }
}
