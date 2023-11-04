import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [MailController],
  providers: [MailService, JwtService],
})
export class MailModule {}
