/**
 * @file create-service.dto.ts
 * @description DTO para crear un servicio
 * @author Turns Team
 * @created 2025-11-08
 */

import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsNumber()
  @Min(5)
  duration: number; // Duración en minutos

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  color?: string; // Color en formato hex para el calendario
}
