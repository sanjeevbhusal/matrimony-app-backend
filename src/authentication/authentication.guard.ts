import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    let payload;

    try {
      payload = await this.jwt.verifyAsync(token);
    } catch (err) {
      throw new UnauthorizedException();
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    request.user = user;

    return true;
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
