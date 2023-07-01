import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { PrismaService } from 'src/prisma.service';
import { PasswordService } from './password.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig, Config } from 'src/common/configs/config.interface';

@Module({
  providers: [AuthenticationService, PrismaService, PasswordService],
  controllers: [AuthenticationController],
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const securityConfig = configService.get<SecurityConfig>('security');
        return {
          secret: securityConfig.secretKey,
          signOptions: {
            expiresIn: securityConfig.expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AuthenticationModule {}
