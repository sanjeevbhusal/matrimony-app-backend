import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [MessageController],
  providers: [MessageService, PrismaService],
})
export class MessageModule {}
