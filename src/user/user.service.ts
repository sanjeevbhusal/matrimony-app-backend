import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import ObjectID from 'bson-objectid';
import { UpdateUserDto } from './dtos/updateUser.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async getUser(id: string) {
    return this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  async updateUser(propertiesToUpdate: Partial<UpdateUserDto>, id: string) {
    if (!ObjectID.isValid(id)) {
      throw new BadRequestException('Format of User Id is incorrect');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User doesnot exist');
    }

    return this.prisma.user.update({
      data: { ...propertiesToUpdate },
      where: {
        id,
      },
    });
  }
}
