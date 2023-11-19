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

  async getUsers(currentUser: User, all: string, liked: string) {
    // How do you calculate which profile should be shown to the user.
    // If there are some interest matching, we can consider those profiles.
    // If user is from the same address, we can consider those profiles.
    // If user is within +-5 years of age, we can consider those profiles.

    // Calculate the score associated with each profile.
    // Return the top 10 profile with the highest score.

    if (liked) {
      const users = await this.prisma.like.findMany({
        where: {
          likedBy: currentUser.id,
        },
        select: {
          likedUser: true,
        },
      });

      const likedUsers = users.map((user) => user.likedUser);
      return likedUsers;
    }

    const users = await this.prisma.user.findMany();
    console.log({ all });

    if (all === 'true') {
      return users;
    }

    const userScoresMapping = [];

    users.forEach((user) => {
      let score = 0;

      if (user.currentAddress === currentUser.currentAddress) {
        score += 10;
      }

      if (user.age >= currentUser.age - 5 || user.age <= currentUser.age + 5) {
        score += 10;
      }

      user.interests.forEach((interest) => {
        if (currentUser.interests.includes(interest)) {
          score += 10;
        }
      });

      userScoresMapping.push({
        [user.id]: score,
      });
    });

    const sortedUserScoresMapping = userScoresMapping.sort((a, b) => {
      const aScore = a[Object.keys(a)[0]];
      const bScore = b[Object.keys(b)[0]];
      return bScore - aScore;
    });

    const sortedUsers = [];

    for (let i = 0; i < 10; i++) {
      const userId = Object.keys(sortedUserScoresMapping[i])[0];
      sortedUsers.push(users.find((user) => user.id === userId));
    }

    return sortedUsers;
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
