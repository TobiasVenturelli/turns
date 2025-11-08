/**
 * @file schedules.controller.ts
 * @description Controlador de horarios
 * @author Turns Team
 * @created 2025-11-08
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  CreateScheduleDto,
  UpdateScheduleDto,
  BulkUpdateSchedulesDto,
} from './dto';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  // ===========================================
  // ENDPOINTS PÚBLICOS
  // ===========================================

  /**
   * Obtener horarios de un negocio (público)
   * @param businessId - ID del negocio
   * @returns Lista de horarios
   */
  @Public()
  @Get('business/:businessId')
  async getBusinessSchedules(@Param('businessId') businessId: string) {
    return this.schedulesService.getBusinessSchedules(businessId);
  }

  // ===========================================
  // ENDPOINTS PROTEGIDOS (Profesionales)
  // ===========================================

  /**
   * Obtener mis horarios (profesional)
   * @param businessId - ID del negocio
   * @param userId - ID del usuario autenticado
   * @returns Lista de horarios
   */
  @Get('business/:businessId/my-schedules')
  async getMySchedules(
    @Param('businessId') businessId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.schedulesService.getBusinessSchedules(businessId, userId);
  }

  /**
   * Crear un horario
   * @param businessId - ID del negocio
   * @param userId - ID del usuario autenticado
   * @param dto - Datos del horario
   * @returns Horario creado
   */
  @Post('business/:businessId')
  async createSchedule(
    @Param('businessId') businessId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateScheduleDto,
  ) {
    return this.schedulesService.createSchedule(businessId, userId, dto);
  }

  /**
   * Actualizar horarios de forma masiva
   * @param businessId - ID del negocio
   * @param userId - ID del usuario autenticado
   * @param dto - Nuevos horarios
   * @returns Horarios creados
   */
  @Put('business/:businessId/bulk')
  async bulkUpdateSchedules(
    @Param('businessId') businessId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: BulkUpdateSchedulesDto,
  ) {
    return this.schedulesService.bulkUpdateSchedules(businessId, userId, dto);
  }

  /**
   * Actualizar un horario
   * @param id - ID del horario
   * @param userId - ID del usuario autenticado
   * @param dto - Datos a actualizar
   * @returns Horario actualizado
   */
  @Put(':id')
  async updateSchedule(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateScheduleDto,
  ) {
    return this.schedulesService.updateSchedule(id, userId, dto);
  }

  /**
   * Eliminar un horario
   * @param id - ID del horario
   * @param userId - ID del usuario autenticado
   */
  @Delete(':id')
  async deleteSchedule(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.schedulesService.deleteSchedule(id, userId);
  }
}
