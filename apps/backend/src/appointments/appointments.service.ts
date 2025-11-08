/**
 * @file appointments.service.ts
 * @description Servicio para gestión de citas
 * @author Turns Team
 * @created 2025-11-07
 */

import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtener slots disponibles para un servicio en una fecha específica
   * @param businessId - ID del negocio
   * @param serviceId - ID del servicio
   * @param date - Fecha en formato YYYY-MM-DD
   * @returns Array de slots disponibles
   */
  async getAvailableSlots(businessId: string, serviceId: string, date: string) {
    // Obtener el servicio
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    // Obtener día de la semana (0 = Domingo, 1 = Lunes, etc.)
    const dateObj = new Date(date + 'T00:00:00');
    const dayOfWeek = dateObj.getDay();

    // Obtener horario del negocio para ese día
    const schedule = await this.prisma.schedule.findFirst({
      where: {
        businessId,
        dayOfWeek,
        isActive: true,
      },
    });

    if (!schedule) {
      return []; // No hay horario para este día
    }

    // Obtener citas existentes para ese día
    const startOfDay = new Date(date + 'T00:00:00');
    const endOfDay = new Date(date + 'T23:59:59');

    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        businessId,
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
        },
      },
    });

    // Generar slots disponibles
    const slots = this.generateTimeSlots(
      schedule.startTime,
      schedule.endTime,
      service.duration,
      existingAppointments,
      date,
    );

    return slots;
  }

  /**
   * Generar slots de tiempo disponibles
   */
  private generateTimeSlots(
    startTime: string,
    endTime: string,
    duration: number,
    existingAppointments: { startTime: Date; endTime: Date }[],
    date: string,
  ) {
    const slots: { startTime: string; endTime: string; available: boolean }[] =
      [];

    // Convertir "09:00" a minutos desde medianoche
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    let currentMinutes = startMinutes;

    while (currentMinutes + duration <= endMinutes) {
      const slotStartTime = this.minutesToTime(currentMinutes);
      const slotEndTime = this.minutesToTime(currentMinutes + duration);

      const slotStart = new Date(`${date}T${slotStartTime}`);
      const slotEnd = new Date(`${date}T${slotEndTime}`);

      // Verificar si el slot está ocupado
      const isOccupied = existingAppointments.some((appointment) => {
        return (
          (slotStart >= appointment.startTime &&
            slotStart < appointment.endTime) ||
          (slotEnd > appointment.startTime && slotEnd <= appointment.endTime) ||
          (slotStart <= appointment.startTime && slotEnd >= appointment.endTime)
        );
      });

      slots.push({
        startTime: slotStartTime,
        endTime: slotEndTime,
        available: !isOccupied,
      });

      currentMinutes += 30; // Incrementar en intervalos de 30 minutos
    }

    return slots;
  }

  /**
   * Convertir minutos a formato HH:MM
   */
  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  /**
   * Crear una nueva cita
   */
  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
    userId?: string,
  ) {
    const { businessId, serviceId, startTime, endTime, notes } =
      createAppointmentDto;

    // Verificar que hay un customerId
    const customerId = userId || createAppointmentDto.customerId;
    if (!customerId) {
      throw new BadRequestException(
        'Debes estar autenticado o proporcionar un customerId',
      );
    }

    // Verificar que el negocio existe y obtener el professionalId
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { userId: true },
    });

    if (!business) {
      throw new NotFoundException('Negocio no encontrado');
    }

    // Verificar que el servicio existe
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    // Verificar que el slot está disponible
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    const conflictingAppointment = await this.prisma.appointment.findFirst({
      where: {
        businessId,
        status: {
          in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
        },
        OR: [
          {
            AND: [
              { startTime: { lte: startDate } },
              { endTime: { gt: startDate } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endDate } },
              { endTime: { gte: endDate } },
            ],
          },
          {
            AND: [
              { startTime: { gte: startDate } },
              { endTime: { lte: endDate } },
            ],
          },
        ],
      },
    });

    if (conflictingAppointment) {
      throw new BadRequestException(
        'El horario seleccionado ya no está disponible',
      );
    }

    // Crear la cita
    const appointment = await this.prisma.appointment.create({
      data: {
        businessId,
        serviceId,
        customerId,
        professionalId: business.userId,
        date: startDate, // Mantener compatibilidad con el schema
        startTime: startDate,
        endTime: endDate,
        status: AppointmentStatus.PENDING,
        notes,
      },
      include: {
        service: true,
        business: true,
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    return appointment;
  }

  /**
   * Obtener citas del usuario
   */
  async getUserAppointments(userId: string) {
    const appointments = await this.prisma.appointment.findMany({
      where: { customerId: userId },
      include: {
        service: true,
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
            address: true,
            city: true,
            phone: true,
          },
        },
      },
      orderBy: { startTime: 'desc' },
    });

    return appointments;
  }

  /**
   * Obtener una cita por ID
   */
  async getAppointmentById(appointmentId: string, userId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        service: true,
        business: true,
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        professional: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    // Verificar que el usuario es el cliente o el profesional
    if (
      appointment.customerId !== userId &&
      appointment.professionalId !== userId
    ) {
      throw new ForbiddenException('No tienes acceso a esta cita');
    }

    return appointment;
  }

  /**
   * Obtener citas del profesional (negocio)
   */
  async getProfessionalAppointments(
    userId: string,
    status?: AppointmentStatus,
    startDate?: string,
    endDate?: string,
  ) {
    const where: {
      professionalId: string;
      status?: AppointmentStatus;
      startTime?: {
        gte: Date;
        lte: Date;
      };
    } = {
      professionalId: userId,
    };

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const appointments = await this.prisma.appointment.findMany({
      where,
      include: {
        service: true,
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
      orderBy: { startTime: 'asc' },
    });

    return appointments;
  }

  /**
   * Actualizar una cita
   */
  async updateAppointment(
    appointmentId: string,
    userId: string,
    dto: UpdateAppointmentDto,
  ) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    // Solo el profesional puede actualizar el status de la cita
    if (
      dto.status &&
      appointment.professionalId !== userId &&
      appointment.customerId !== userId
    ) {
      throw new ForbiddenException(
        'No tienes permisos para actualizar esta cita',
      );
    }

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: dto,
      include: {
        service: true,
        business: true,
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    return updatedAppointment;
  }

  /**
   * Cancelar una cita
   */
  async cancelAppointment(appointmentId: string, userId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    // Tanto el cliente como el profesional pueden cancelar
    if (
      appointment.customerId !== userId &&
      appointment.professionalId !== userId
    ) {
      throw new ForbiddenException('No tienes permiso para cancelar esta cita');
    }

    // Verificar que la cita no esté ya cancelada o completada
    if (
      appointment.status === AppointmentStatus.CANCELLED ||
      appointment.status === AppointmentStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'No se puede cancelar una cita que ya está cancelada o completada',
      );
    }

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.CANCELLED,
        cancelledAt: new Date(),
      },
      include: {
        service: true,
        business: true,
      },
    });

    return updatedAppointment;
  }

  /**
   * Reprogramar una cita
   */
  async rescheduleAppointment(
    appointmentId: string,
    userId: string,
    dto: RescheduleAppointmentDto,
  ) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        service: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    // Solo el cliente o el profesional pueden reprogramar
    if (
      appointment.customerId !== userId &&
      appointment.professionalId !== userId
    ) {
      throw new ForbiddenException(
        'No tienes permiso para reprogramar esta cita',
      );
    }

    // Verificar que la cita no esté cancelada o completada
    if (
      appointment.status === AppointmentStatus.CANCELLED ||
      appointment.status === AppointmentStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'No se puede reprogramar una cita cancelada o completada',
      );
    }

    // Verificar disponibilidad en el nuevo horario
    const newStartTime = new Date(dto.startTime);
    const newEndTime = new Date(dto.endTime);

    const conflictingAppointment = await this.prisma.appointment.findFirst({
      where: {
        businessId: appointment.businessId,
        id: { not: appointmentId }, // Excluir la cita actual
        status: {
          in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
        },
        OR: [
          {
            AND: [
              { startTime: { lte: newStartTime } },
              { endTime: { gt: newStartTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: newEndTime } },
              { endTime: { gte: newEndTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: newStartTime } },
              { endTime: { lte: newEndTime } },
            ],
          },
        ],
      },
    });

    if (conflictingAppointment) {
      throw new BadRequestException(
        'El nuevo horario seleccionado ya no está disponible',
      );
    }

    // Actualizar la cita
    const updatedAppointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        startTime: newStartTime,
        endTime: newEndTime,
        date: newStartTime,
        notes: dto.notes || appointment.notes,
        status: AppointmentStatus.PENDING, // Volver a estado pendiente
      },
      include: {
        service: true,
        business: true,
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    return updatedAppointment;
  }

  /**
   * Confirmar una cita (solo profesional)
   */
  async confirmAppointment(appointmentId: string, userId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    // Solo el profesional puede confirmar
    if (appointment.professionalId !== userId) {
      throw new ForbiddenException(
        'Solo el profesional puede confirmar la cita',
      );
    }

    if (appointment.status !== AppointmentStatus.PENDING) {
      throw new BadRequestException(
        'Solo se pueden confirmar citas pendientes',
      );
    }

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.CONFIRMED },
      include: {
        service: true,
        business: true,
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    return updatedAppointment;
  }

  /**
   * Marcar cita como completada (solo profesional)
   */
  async completeAppointment(appointmentId: string, userId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    // Solo el profesional puede completar
    if (appointment.professionalId !== userId) {
      throw new ForbiddenException(
        'Solo el profesional puede completar la cita',
      );
    }

    if (
      appointment.status !== AppointmentStatus.CONFIRMED &&
      appointment.status !== AppointmentStatus.PENDING
    ) {
      throw new BadRequestException(
        'Solo se pueden completar citas confirmadas o pendientes',
      );
    }

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.COMPLETED,
        completedAt: new Date(),
      },
      include: {
        service: true,
        business: true,
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    return updatedAppointment;
  }

  /**
   * Marcar cita como no show (solo profesional)
   */
  async markNoShow(appointmentId: string, userId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    // Solo el profesional puede marcar como no show
    if (appointment.professionalId !== userId) {
      throw new ForbiddenException(
        'Solo el profesional puede marcar la cita como no show',
      );
    }

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.NO_SHOW },
      include: {
        service: true,
        business: true,
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    return updatedAppointment;
  }
}
