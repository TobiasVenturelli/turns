/**
 * @file refresh-token.dto.ts
 * @description DTO para refresh token
 * @author Turns Team
 * @created 2025-11-07
 */

import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsString({ message: 'El refresh token debe ser un string' })
  @IsNotEmpty({ message: 'El refresh token es requerido' })
  refreshToken: string;
}
