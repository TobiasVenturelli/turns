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
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
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
        customerId: userId || createAppointmentDto.customerId,
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
   * Cancelar una cita
   */
  async cancelAppointment(appointmentId: string, userId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    if (appointment.customerId !== userId) {
      throw new BadRequestException(
        'No tienes permiso para cancelar esta cita',
      );
    }

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.CANCELLED },
      include: {
        service: true,
        business: true,
      },
    });

    return updatedAppointment;
  }
}
