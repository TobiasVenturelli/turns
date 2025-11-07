/**
 * @file jwt-payload.interface.ts
 * @description Tipos para payloads JWT y request user
 * @author Turns Team
 * @created 2025-11-07
 */

import { UserRole } from '@prisma/client';

/**
 * Payload del JWT
 */
export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/**
 * Usuario autenticado en el request
 */
export interface RequestUser {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  avatar?: string | null;
}

/**
 * Usuario del refresh token
 */
export interface RefreshTokenUser {
  userId: string;
  refreshToken: string;
}
