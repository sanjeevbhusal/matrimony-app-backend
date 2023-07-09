import { Body, Controller, Post, Get, NotFoundException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { User as UserEntity } from '../common/decorators/params/user.decorator';
import { User } from '@prisma/client';
import { Token } from './interface/token';
import { Auth } from 'src/common/decorators/routes/auth.decorator';

@Controller('authentication')
export class AuthenticationController {
  constructor(private auth: AuthenticationService) {}

  @Post('/signup')
  async signup(
    @Body() { firstName, lastName, email, password }: SignupDto,
  ): Promise<Token> {
    const user = await this.auth.createUser(
      firstName,
      lastName,
      email,
      password,
    );
    return this.auth.generateTokens({ userId: user.id });
  }

  @Post('/login')
  async login(@Body() { email, password }: LoginDto): Promise<Token> {
    return await this.auth.login(email, password);
  }

  @Get('/get_user_from_token')
  @Auth()
  getUserFromToken(@UserEntity() user: User): User {
    return user;
  }
}
