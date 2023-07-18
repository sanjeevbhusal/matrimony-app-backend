import { IsEmail } from 'class-validator';

class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export { ForgotPasswordDto };
