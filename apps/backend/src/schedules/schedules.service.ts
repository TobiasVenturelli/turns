/**
 * @file schedules.service.ts
 * @description Servicio para gestión de horarios
 * @author Turns Team
 * @created 2025-11-08
 */

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateScheduleDto,
  UpdateScheduleDto,
  BulkUpdateSchedulesDto,
} from './dto';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtener horarios de un negocio
   * @param businessId - ID del negocio
   * @param userId - ID del usuario (para verificar ownership si es necesario)
   * @returns Lista de horarios
   */
  async getBusinessSchedules(businessId: string, userId?: string) {
    // Si se proporciona userId, verificar ownership
    if (userId) {
      const business = await this.prisma.business.findFirst({
        where: { id: businessId, userId },
      });

      if (!business) {
        throw new ForbiddenException('No tienes acceso a este negocio');
      }
    }

    const schedules = await this.prisma.schedule.findMany({
      where: { businessId },
      orderBy: { dayOfWeek: 'asc' },
    });

    return schedules;
  }

  /**
   * Crear un horario
   * @param businessId - ID del negocio
   * @param userId - ID del usuario
   * @param dto - Datos del horario
   * @returns Horario creado
   */
  async createSchedule(
    businessId: string,
    userId: string,
    dto: CreateScheduleDto,
  ) {
    // Verificar ownership
    const business = await this.prisma.business.findFirst({
      where: { id: businessId, userId },
    });

    if (!business) {
      throw new NotFoundException('Negocio no encontrado o no tienes permisos');
    }

    // Validar horarios
    this.validateTimeRange(dto.startTime, dto.endTime);

    // Verificar que no exista ya un horario para ese día
    const existingSchedule = await this.prisma.schedule.findFirst({
      where: {
        businessId,
        dayOfWeek: dto.dayOfWeek,
      },
    });

    if (existingSchedule) {
      throw new BadRequestException(
        `Ya existe un horario para ese día de la semana`,
      );
    }

    // Crear horario
    const schedule = await this.prisma.schedule.create({
      data: {
        ...dto,
        businessId,
      },
    });

    return schedule;
  }

  /**
   * Actualizar un horario
   * @param id - ID del horario
   * @param userId - ID del usuario
   * @param dto - Datos a actualizar
   * @returns Horario actualizado
   */
  async updateSchedule(id: string, userId: string, dto: UpdateScheduleDto) {
    // Verificar que el horario existe y el usuario tiene permisos
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: {
        business: {
          select: { userId: true },
        },
      },
    });

    if (!schedule) {
      throw new NotFoundException('Horario no encontrado');
    }

    if (schedule.business.userId !== userId) {
      throw new ForbiddenException('No tienes permisos para este horario');
    }

    // Validar horarios si se están actualizando
    if (dto.startTime && dto.endTime) {
      this.validateTimeRange(dto.startTime, dto.endTime);
    }

    // Actualizar horario
    const updatedSchedule = await this.prisma.schedule.update({
      where: { id },
      data: dto,
    });

    return updatedSchedule;
  }

  /**
   * Eliminar un horario
   * @param id - ID del horario
   * @param userId - ID del usuario
   */
  async deleteSchedule(id: string, userId: string) {
    // Verificar ownership
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: {
        business: {
          select: { userId: true },
        },
      },
    });

    if (!schedule) {
      throw new NotFoundException('Horario no encontrado');
    }

    if (schedule.business.userId !== userId) {
      throw new ForbiddenException('No tienes permisos para este horario');
    }

    // Eliminar horario
    await this.prisma.schedule.delete({
      where: { id },
    });

    return { message: 'Horario eliminado correctamente' };
  }

  /**
   * Actualización masiva de horarios (reemplazar todos)
   * @param businessId - ID del negocio
   * @param userId - ID del usuario
   * @param dto - Nuevos horarios
   * @returns Horarios creados
   */
  async bulkUpdateSchedules(
    businessId: string,
    userId: string,
    dto: BulkUpdateSchedulesDto,
  ) {
    // Verificar ownership
    const business = await this.prisma.business.findFirst({
      where: { id: businessId, userId },
    });

    if (!business) {
      throw new NotFoundException('Negocio no encontrado o no tienes permisos');
    }

    // Validar que no haya días duplicados
    const days = dto.schedules.map((s) => s.dayOfWeek);
    const uniqueDays = new Set(days);
    if (days.length !== uniqueDays.size) {
      throw new BadRequestException('No puede haber días duplicados');
    }

    // Validar todos los horarios
    for (const schedule of dto.schedules) {
      this.validateTimeRange(schedule.startTime, schedule.endTime);
    }

    // Eliminar todos los horarios existentes y crear los nuevos (transacción)
    const result = await this.prisma.$transaction(async (prisma) => {
      // Eliminar horarios existentes
      await prisma.schedule.deleteMany({
        where: { businessId },
      });

      // Crear nuevos horarios
      const createdSchedules = await Promise.all(
        dto.schedules.map((schedule) =>
          prisma.schedule.create({
            data: {
              ...schedule,
              businessId,
            },
          }),
        ),
      );

      return createdSchedules;
    });

    return result;
  }

  /**
   * Validar rango de tiempo
   * @param startTime - Hora de inicio (HH:MM)
   * @param endTime - Hora de fin (HH:MM)
   */
  private validateTimeRange(startTime: string, endTime: string) {
    const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;

    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      throw new BadRequestException(
        'Formato de hora inválido. Debe ser HH:MM (00:00 - 23:59)',
      );
    }

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    if (startMinutes >= endMinutes) {
      throw new BadRequestException(
        'La hora de inicio debe ser anterior a la hora de fin',
      );
    }

    // Validar mínimo 1 hora de operación
    if (endMinutes - startMinutes < 60) {
      throw new BadRequestException(
        'El horario debe tener al menos 1 hora de duración',
      );
    }
  }
}
