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
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly password: PasswordService,
    private readonly jwtService: JwtService,
    private readonly mail: MailService,
  ) {}

  async signup(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) {
    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const hashedPassword = await this.password.hashPassword(password);

    const user = await this.prisma.user.create({
      data: { firstName, lastName, email, password: hashedPassword },
    });

    this.mail.sendWelcomeEmail(user.email);

    return user;
  }

  async login(email: string, password: string) {
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

  async forgotPassword(email: string) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User doesnot Exist');
    }

    // create a token and persist it to database.
    const token = this.jwtService.sign({ email });
    await this.prisma.token.create({
      data: {
        token,
      },
    });

    this.mail.sendResetPasswordEmail(user.email, token);

    return {
      message:
        'Password reset email sent succesfully. Please check your email to reset your password',
    };
  }

  async validateResetPasswordToken(tokenToValidate: string) {
    const token = await this.prisma.token.findFirst({
      where: {
        token: tokenToValidate,
      },
    });

    if (token.used) {
      throw new UnauthorizedException('Token has already been used');
    }

    try {
      return this.jwtService.verify<{ email: string }>(tokenToValidate);
    } catch (error) {
      throw new UnauthorizedException('Token is invalid');
    }
  }

  async resetPassword(newPassword: string, token: string) {
    const { email } = await this.validateResetPasswordToken(token);

    const hashedPassword = await this.password.hashPassword(newPassword);

    await this.prisma.user.update({
      data: {
        password: hashedPassword,
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

    return { message: 'Password has been reset succesfully' };
  }

  private findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
