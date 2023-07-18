import { IsString } from 'class-validator';

class UpdateUserParamDto {
  @IsString()
  id: string;
}

export { UpdateUserParamDto };
