/**
 * @file appointments.controller.ts
 * @description Controlador de citas
 * @author Turns Team
 * @created 2025-11-07
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AppointmentStatus } from '@prisma/client';
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
   * Obtener citas del usuario (cliente)
   * Puede filtrar por negocio específico usando businessId o businessSlug
   */
  @Get('my-appointments')
  async getMyAppointments(
    @CurrentUser() user: RequestUser,
    @Query('businessId') businessId?: string,
    @Query('businessSlug') businessSlug?: string,
  ) {
    return this.appointmentsService.getUserAppointments(
      user.id,
      businessId,
      businessSlug,
    );
  }

  /**
   * Obtener citas del profesional (con filtros)
   */
  @Get('professional/appointments')
  async getProfessionalAppointments(
    @CurrentUser() user: RequestUser,
    @Query('status') status?: AppointmentStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.appointmentsService.getProfessionalAppointments(
      user.id,
      status,
      startDate,
      endDate,
    );
  }

  /**
   * Obtener estadísticas del profesional
   */
  @Get('professional/stats')
  async getProfessionalStats(@CurrentUser() user: RequestUser) {
    return this.appointmentsService.getProfessionalStats(user.id);
  }

  /**
   * Obtener clientes del profesional
   */
  @Get('professional/customers')
  async getProfessionalCustomers(@CurrentUser() user: RequestUser) {
    return this.appointmentsService.getProfessionalCustomers(user.id);
  }

  /**
   * Obtener una cita por ID
   */
  @Get(':id')
  async getAppointmentById(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.appointmentsService.getAppointmentById(id, user.id);
  }

  /**
   * Actualizar una cita
   */
  @Put(':id')
  async updateAppointment(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
    @Body() dto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.updateAppointment(id, user.id, dto);
  }

  /**
   * Cancelar una cita
   */
  @Post(':id/cancel')
  async cancelAppointment(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.appointmentsService.cancelAppointment(id, user.id);
  }

  /**
   * Reprogramar una cita
   */
  @Post(':id/reschedule')
  async rescheduleAppointment(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
    @Body() dto: RescheduleAppointmentDto,
  ) {
    return this.appointmentsService.rescheduleAppointment(id, user.id, dto);
  }

  /**
   * Confirmar una cita (solo profesional)
   */
  @Patch(':id/confirm')
  async confirmAppointment(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.appointmentsService.confirmAppointment(id, user.id);
  }

  /**
   * Completar una cita (solo profesional)
   */
  @Patch(':id/complete')
  async completeAppointment(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.appointmentsService.completeAppointment(id, user.id);
  }

  /**
   * Marcar como no show (solo profesional)
   */
  @Patch(':id/no-show')
  async markNoShow(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.appointmentsService.markNoShow(id, user.id);
  }
}
