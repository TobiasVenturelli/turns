/**
 * @file reschedule-appointment.dto.ts
 * @description DTO para reprogramar una cita
 * @author Turns Team
 * @created 2025-11-08
 */

import { IsDateString, IsOptional, IsString } from 'class-validator';

export class RescheduleAppointmentDto {
  @IsDateString()
  startTime: string; // ISO 8601 string

  @IsDateString()
  endTime: string; // ISO 8601 string

  @IsString()
  @IsOptional()
  notes?: string;
}
