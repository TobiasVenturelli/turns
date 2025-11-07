/**
 * @file register.dto.ts
 * @description DTO para registro de usuarios
 * @author Turns Team
 * @created 2025-11-07
 */

import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @IsEmail({}, { message: 'El email debe ser válido' })
  email: string;

  @IsString({ message: 'El password debe ser un string' })
  @MinLength(8, { message: 'El password debe tener al menos 8 caracteres' })
  @MaxLength(50, { message: 'El password no puede tener más de 50 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'El password debe contener al menos una mayúscula, una minúscula, un número y un carácter especial',
    },
  )
  password: string;

  @IsString({ message: 'El nombre debe ser un string' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  firstName: string;

  @IsString({ message: 'El apellido debe ser un string' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El apellido no puede tener más de 50 caracteres' })
  lastName: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser un string' })
  phone?: string;

  @IsEnum(UserRole, { message: 'El rol debe ser válido' })
  @IsOptional()
  role?: UserRole;
}
