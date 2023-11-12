import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async getMessages(chatId: string) {
    return this.prisma.message.findMany({
      where: {
        chatId,
      },
    });
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
