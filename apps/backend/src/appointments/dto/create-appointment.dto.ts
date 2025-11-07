/**
 * @file create-appointment.dto.ts
 * @description DTO para crear una cita
 * @author Turns Team
 * @created 2025-11-07
 */

import { IsString, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  businessId: string;

  @IsUUID()
  serviceId: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  customerId?: string; // Si el usuario está autenticado
}
