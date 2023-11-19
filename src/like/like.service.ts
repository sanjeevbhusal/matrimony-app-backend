import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  createLike(by: string, to: string) {
    return this.prisma.like.create({
      data: {
        likedBy: by,
        liked: to,
      },
    });
  }

  getLike(by: string, to: string) {
    return this.prisma.like.findFirst({
      where: {
        likedBy: by,
        liked: to,
      },
    });
  }

  deleteLike(id: string) {
    return this.prisma.like.delete({
      where: {
        id,
      },
    });
  }
}
