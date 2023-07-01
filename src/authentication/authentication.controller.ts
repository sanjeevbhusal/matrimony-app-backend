import { Body, Controller, Post, Get } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { User as UserEntity } from '../common/decorators/params/user.decorator';
import { User } from '@prisma/client';
import { Token } from './interface/token';

@Controller('authentication')
export class AuthenticationController {
  constructor(private auth: AuthenticationService) {}

  @Post('/signup')
  async signup(@Body() { email, password }: SignupDto): Promise<void> {
    return await this.auth.createUser(email, password);
  }

  @Post('/login')
  async login(@Body() { email, password }: LoginDto): Promise<Token> {
    return await this.auth.login(email, password);
  }

  @Get('/get_user_from_token')
  getUserFromToken(@UserEntity() user: User): User {
    return user;
  }
}
