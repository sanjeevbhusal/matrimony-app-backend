import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Interest } from '@prisma/client';

class UpdateUserDto {
  @IsOptional()
  @IsArray()
  interests: Interest[];

  @IsOptional()
  @IsString()
  bio: string;

  @IsOptional()
  @IsNumber()
  age: number;

  @IsOptional()
  @IsString()
  highestEducation: string;

  @IsOptional()
  @IsString()
  currentProfession: string;

  @IsOptional()
  @IsString()
  currentAddress: string;

  @IsOptional()
  @IsString()
  image: string;
}

export { UpdateUserDto };
