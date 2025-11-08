/**
 * @file bulk-update-schedules.dto.ts
 * @description DTO para actualización masiva de horarios
 * @author Turns Team
 * @created 2025-11-08
 */

import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateScheduleDto } from './create-schedule.dto';

export class BulkUpdateSchedulesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateScheduleDto)
  schedules: CreateScheduleDto[];
}
