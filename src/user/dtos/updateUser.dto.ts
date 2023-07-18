import { IsArray, IsOptional, IsString } from 'class-validator';
import { Interest } from '@prisma/client';

class UpdateUserDto {
  @IsOptional()
  @IsArray()
  interests: Interest[];

  @IsOptional()
  @IsString()
  bio: string;
}

export { UpdateUserDto };
