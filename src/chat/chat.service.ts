import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getChats(userId: string) {
    return this.prisma.chat.findMany({
      where: {
        userIds: {
          has: userId,
        },
      },
      include: {
        users: true,
      },
    });
  }
}
