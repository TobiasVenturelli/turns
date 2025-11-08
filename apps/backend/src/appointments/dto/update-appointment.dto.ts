/**
 * @file update-appointment.dto.ts
 * @description DTO para actualizar una cita
 * @author Turns Team
 * @created 2025-11-08
 */

import { IsString, IsOptional, IsEnum } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class UpdateAppointmentDto {
  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;
}
