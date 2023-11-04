import {
  Body,
  Controller,
  Post,
  Get,
  Res,
  Query,
  HttpCode,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { User as UserEntity } from '../common/decorators/params/user.decorator';
import { User } from '@prisma/client';
import { Auth } from 'src/common/decorators/routes/auth.decorator';
import { Response } from 'express';
import { ForgotPasswordDto } from './dtos/forgotPassword.dto';
import { ResetPasswordQueryDto } from './dtos/resetPasswordQuery.dto';
import { ResetPasswordDto } from './dtos/resetPassword.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private auth: AuthenticationService) {}

  @HttpCode(201)
  @Post('/signup')
  async signup(
    @Body() { firstName, lastName, email, password }: SignupDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<User> {
    const user = await this.auth.signup(firstName, lastName, email, password);
    response.cookie('userId', user.id, { signed: true });
    return user;
  }

  @HttpCode(200)
  @Post('/login')
  async login(
    @Body() { email, password }: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<User> {
    const user = await this.auth.login(email, password);
    response.cookie('userId', user.id, { signed: true });
    return user;
  }

  @HttpCode(200)
  @Post('/forgot-password')
  forgotPassword(
    @Body() { email }: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    return this.auth.forgotPassword(email);
  }

  @HttpCode(200)
  @Post('/reset-password')
  resetPassword(
    @Body() { password }: ResetPasswordDto,
    @Query() { token }: ResetPasswordQueryDto,
  ): Promise<{ message: string }> {
    return this.auth.resetPassword(password, token);
  }

  @HttpCode(200)
  @Get('/verify-reset-password-token')
  async validateResetPasswordToken(
    @Query() { token }: ResetPasswordQueryDto,
  ): Promise<{ message: string }> {
    await this.auth.validateResetPasswordToken(token);
    return { message: 'Token has been verified succesfully' };
  }

  @HttpCode(200)
  @Get('/current-user')
  @Auth()
  getUserFromToken(@UserEntity() user: User): User {
    return user;
  }

  @HttpCode(200)
  @Post('/logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('userId');
  }
}
