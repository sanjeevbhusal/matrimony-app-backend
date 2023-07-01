import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash, compare } from 'bcrypt';
import { SecurityConfig, Config } from 'src/common/configs/config.interface';

@Injectable()
export class PasswordService {
  constructor(private configService: ConfigService<Config>) {}

  get bcryptSaltRounds(): string | number {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    const round = securityConfig.saltRound;
    return round;
  }

  hashPassword(password: string): Promise<string> {
    return hash(password, this.bcryptSaltRounds);
  }

  validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
