import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RequestWithUser } from './interface/RequestWithUser';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userId = request.signedCookies.userId;

    if (userId === undefined) {
      throw new UnauthorizedException('User Id is not present in Session');
    }

    if (userId === false) {
      throw new UnauthorizedException('User Id in Session is invalid');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        chats: {
          include: {
            users: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'User associated with session no longer exits.',
      );
    }

    request.user = user;

    return true;
  }
}
