/**
 * @file create-schedule.dto.ts
 * @description DTO para crear un horario
 * @author Turns Team
 * @created 2025-11-08
 */

import {
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateScheduleDto {
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek: number; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

  @IsString()
  startTime: string; // Formato: "09:00"

  @IsString()
  endTime: string; // Formato: "18:00"

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
