import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getChats(userId: string) {
    console.log(userId);

    return this.prisma.chat.findMany({
      where: {
        userIds: {
          has: userId,
        },
      },
    });
  }
}
