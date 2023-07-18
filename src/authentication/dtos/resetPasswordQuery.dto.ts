import { IsString } from 'class-validator';

class ResetPasswordQueryDto {
  @IsString()
  token: string;
}

export { ResetPasswordQueryDto };
