/**
 * @file current-user.decorator.ts
 * @description Decorador para obtener el usuario actual de la request
 * @author Turns Team
 * @created 2025-11-07
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser, RefreshTokenUser } from '../types/jwt-payload.interface';

/**
 * Decorador para obtener el usuario actual autenticado
 * Uso: @CurrentUser() user: RequestUser
 */
export const CurrentUser = createParamDecorator(
  (
    data: unknown,
    ctx: ExecutionContext,
  ): RequestUser | RefreshTokenUser | undefined => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return request.user as RequestUser | RefreshTokenUser | undefined;
  },
);
