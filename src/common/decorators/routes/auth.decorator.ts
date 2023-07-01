import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { AuthenticationGuard } from '../../../authentication/authentication.guard';
import { RolesGuard } from '../../../authentication/roles.guard';

export function Auth(...roles: string[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthenticationGuard, RolesGuard),
  );
}
