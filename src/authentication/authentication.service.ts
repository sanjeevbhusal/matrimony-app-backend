import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PasswordService } from './password.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from 'src/common/configs/config.interface';
import { Token } from './interface/token';
import { MailService } from 'src/mail/mail.service';
import { EmailType } from 'src/mail/interface/emailType';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly password: PasswordService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mail: MailService,
  ) {}

  private findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
  // if a user has signed up then, the user should be redirected to onboarding page.

  // what if the user refreshes the page. The user should still be in the onbiarding page.

  // This means, we should know when a  user has completed the onboarding step and when it hasn't.

  // user fetch  ->  intrests.
  // if intrests is not found, then onboarding is not complete

  // if intrests is found, then search for next step of onboarding.

  async signup(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<User> {
    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await this.password.hashPassword(password);

    const user = await this.prisma.user.create({
      data: { firstName, lastName, email, password: hashedPassword },
    });

    this.mail.sendMail(user.email, EmailType.Welcome);

    return user;
  }

  async validateResetPasswordToken(tokenToValidate: string) {
    // TODO: Make sure this token is not used twice.

    const token = await this.prisma.token.findFirst({
      where: {
        token: tokenToValidate,
      },
    });

    if (token.used) {
      throw new UnauthorizedException('Token has already been used');
    }

    try {
      return this.jwtService.verify(tokenToValidate);
    } catch (error) {
      throw new UnauthorizedException('token is invalid');
    }
  }

  async resetPassword(newPassword: string, token: string) {
    const { email } = await this.validateResetPasswordToken(token);

    const user = await this.prisma.user.update({
      data: {
        password: newPassword,
      },
      where: {
        email,
      },
    });

    await this.prisma.token.update({
      data: {
        used: true,
      },
      where: {
        token,
      },
    });

    return user;
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Email doesnot exist');
    }

    const isPasswordValid = await this.password.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is invalid');
    }

    return user;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User doesnot Exist');
    }

    this.mail.sendMail(user.email, EmailType.ResetPassword);
  }

  generateTokens(payload: { userId: string }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: string }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: securityConfig.secretKey,
      expiresIn: securityConfig.refreshIn,
    });
  }
}
