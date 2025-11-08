/**
 * @file create-business.dto.ts
 * @description DTO para crear un negocio
 * @author Turns Team
 * @created 2025-11-08
 */

import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsNumber,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateBusinessDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  zipCode?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
