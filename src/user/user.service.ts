import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import ObjectID from 'bson-objectid';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async updateUser({ interests, bio }: Partial<User>, id: string) {
    if (!ObjectID.isValid(id)) {
      throw new BadRequestException('Format of User Id is incorrect');
    }

    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User doesnot exist');
    }

    const fieldsToUpdate = {};

    if (interests) {
      fieldsToUpdate['interests'] = interests;
    }

    if (bio) {
      fieldsToUpdate['bio'] = bio;
    }

    return this.prisma.user.update({
      data: fieldsToUpdate,
      where: {
        id,
      },
    });
  }
}
