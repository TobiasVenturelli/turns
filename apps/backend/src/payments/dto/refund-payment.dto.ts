/**
 * @file refund-payment.dto.ts
 * @description DTO para procesar un reembolso
 * @author Turns Team
 * @created 2025-11-08
 */

import { IsNumber, IsOptional, Min } from 'class-validator';

export class RefundPaymentDto {
  @IsNumber()
  @Min(0.01)
  @IsOptional()
  amount?: number; // Si no se especifica, es reembolso total
}
