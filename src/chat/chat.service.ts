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

  // first and second position should not be user Id and second User Id
  // first and second position should not be second User Id and user Id

  async createChat(userId: string, body: any) {
    let existingChat: any;

    existingChat = await this.prisma.chat.findFirst({
      where: {
        userIds: {
          equals: [userId, body.userId],
        },
      },
    });

    if (existingChat) {
      throw new Error('Chat already exists');
    }

    existingChat = await this.prisma.chat.findFirst({
      where: {
        userIds: {
          equals: [body.userId, userId],
        },
      },
    });

    if (existingChat) {
      throw new Error('Chat already exists');
    }

    if (existingChat) {
      throw new Error('Chat already exists');
    }

    return this.prisma.chat.create({
      data: {
        userIds: [userId, body.userId],
      },
    });
  }
}
