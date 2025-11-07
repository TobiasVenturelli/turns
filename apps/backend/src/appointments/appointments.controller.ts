/**
 * @file appointments.controller.ts
 * @description Controlador de citas
 * @author Turns Team
 * @created 2025-11-07
 */

import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { RequestUser } from '../auth/types/jwt-payload.interface';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  /**
   * Obtener slots disponibles (público)
   * @param businessId - ID del negocio
   * @param serviceId - ID del servicio
   * @param date - Fecha en formato YYYY-MM-DD
   */
  @Public()
  @Get('available-slots')
  async getAvailableSlots(
    @Query('businessId') businessId: string,
    @Query('serviceId') serviceId: string,
    @Query('date') date: string,
  ) {
    return this.appointmentsService.getAvailableSlots(
      businessId,
      serviceId,
      date,
    );
  }

  /**
   * Crear una cita
   * Usuario puede estar autenticado o no
   */
  @Public()
  @Post()
  async createAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @CurrentUser() user?: RequestUser,
  ) {
    return this.appointmentsService.createAppointment(
      createAppointmentDto,
      user?.id,
    );
  }

  /**
   * Obtener citas del usuario (requiere autenticación)
   */
  @Get('my-appointments')
  async getMyAppointments(@CurrentUser() user: RequestUser) {
    return this.appointmentsService.getUserAppointments(user.id);
  }

  /**
   * Cancelar una cita (requiere autenticación)
   */
  @Post(':id/cancel')
  async cancelAppointment(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.appointmentsService.cancelAppointment(id, user.id);
  }
}
