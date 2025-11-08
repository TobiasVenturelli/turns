/**
 * @file update-schedule.dto.ts
 * @description DTO para actualizar un horario
 * @author Turns Team
 * @created 2025-11-08
 */

import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDto } from './create-schedule.dto';

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {}
