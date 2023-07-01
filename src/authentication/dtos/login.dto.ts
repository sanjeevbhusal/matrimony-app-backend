import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  password: string;
}
