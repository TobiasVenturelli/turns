/**
 * @file get-available-slots.dto.ts
 * @description DTO para obtener slots disponibles
 * @author Turns Team
 * @created 2025-11-07
 */

import { IsDateString, IsUUID } from 'class-validator';

export class GetAvailableSlotsDto {
  @IsUUID()
  businessId: string;

  @IsUUID()
  serviceId: string;

  @IsDateString()
  date: string; // Fecha en formato YYYY-MM-DD
}
