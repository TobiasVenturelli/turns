/**
 * @file login.dto.ts
 * @description DTO para inicio de sesión
 * @author Turns Team
 * @created 2025-11-07
 */

import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El email debe ser válido' })
  email: string;

  @IsString({ message: 'El password debe ser un string' })
  @MinLength(1, { message: 'El password es requerido' })
  password: string;
}
