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

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly password: PasswordService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(email: string, password: string): Promise<void> {
    const user = await this.findByEmail(email);

    if (user) {
      throw new ConflictException({ email: 'Email already in use' });
    }

    const hashedPassword = await this.password.hashPassword(password);
    await this.prisma.user.create({
      data: { email, password: hashedPassword },
    });
  }

  async login(email: string, password: string): Promise<Token> {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException({ email: 'Email doesnot exist' });
    }

    const isPasswordValid = await this.password.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is invalid');
    }

    return this.generateTokens({ userId: user.id });
  }

  private generateTokens(payload: { userId: string }): Token {
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
