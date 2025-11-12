/**
 * @file create-payment-preference.dto.ts
 * @description DTO para crear una preferencia de pago
 * @author Turns Team
 * @created 2025-11-08
 */

import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Min,
  IsUUID,
} from 'class-validator';

export class CreatePaymentPreferenceDto {
  @IsUUID()
  @IsNotEmpty()
  appointmentId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
