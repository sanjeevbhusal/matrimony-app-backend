import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { RequestWithUser } from 'src/authentication/interface/RequestWithUser';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
