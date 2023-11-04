import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { Config } from 'src/common/configs/config.interface';

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor(private config: ConfigService<Config>) {
    const emailConfig = this.config.get('mail');
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

  public sendWelcomeEmail(to: string) {
    return this.transporter.sendMail({
      from: 'Sanjeev Bhusal <bhusalsanjeev23@gmail.com>',
      to,
      subject: 'Welcome to Everlasting Ties',
      text: 'Welcome to Everlasting Ties. We hope you will have a great day ahead.',
    });
  }

  public async sendResetPasswordEmail(to: string, resetToken: string) {
    const resetPasswordUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

    return this.transporter.sendMail({
      from: 'Sanjeev Bhusal <bhusalsanjeev23@gmail.com>',
      to,
      subject: 'Reset Password for Everlasting Ties',
      text: `kindly click on the link below to reset password\n${resetPasswordUrl}`,
    });
  }
}
