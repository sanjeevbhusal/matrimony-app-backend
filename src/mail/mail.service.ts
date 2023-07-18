import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { Config } from 'src/common/configs/config.interface';
import { EmailType } from './interface/emailType';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor(
    private config: ConfigService<Config>,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {
    const emailConfig = config.get('mail');
    const email = emailConfig.email;
    const password = emailConfig.password;

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: email,
        pass: password,
      },
    });
  }

  async sendMail(to: string, type: EmailType) {
    if (type === EmailType.ResetPassword) {
      this.sendResetPasswordEmail(to);
    } else if (type === EmailType.Welcome) {
      this.sendWelcomeEmail(to);
    }
  }

  private sendWelcomeEmail(to: string) {
    return this.transporter.sendMail({
      from: 'Sanjeev Bhusal <bhusalsanjeev23@gmail.com>',
      to,
      subject: 'Welcome to Everlasting Ties',
      text: 'Welcome to Everlasting Ties. We hope you will have a great day ahead.',
    });
  }

  private async sendResetPasswordEmail(to: string) {
    const token = this.jwtService.sign({ email: to });

    await this.prisma.token.create({
      data: {
        token,
      },
    });

    const resetPasswordUrl = `http://localhost:5173/reset-password?token=${token}`;

    return this.transporter.sendMail({
      from: 'Sanjeev Bhusal <bhusalsanjeev23@gmail.com>',
      to,
      subject: 'Reset Password for Everlasting Ties',
      text: `kindly click on the link below to reset password\n${resetPasswordUrl}`,
    });
  }
}
