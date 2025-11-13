/**
 * @file appointments.service.ts
 * @description Servicio de gestión de turnos
 */

import api from '@/lib/axios';
import { API_ROUTES } from '@/config/api';
import {
  Appointment,
  CreateAppointmentDto,
  UpdateAppointmentDto,
  DashboardStats,
} from '@/types';

export const appointmentsService = {
  /**
   * Obtener todos los turnos del profesional
   */
  async getAll(params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Appointment[]> {
    const response = await api.get(API_ROUTES.APPOINTMENTS.LIST, { params });
    return response.data;
  },

  /**
   * Crear turno manual
   */
  async create(data: CreateAppointmentDto): Promise<Appointment> {
    const response = await api.post(API_ROUTES.APPOINTMENTS.CREATE, data);
    return response.data;
  },

  /**
   * Actualizar turno
   */
  async update(id: string, data: UpdateAppointmentDto): Promise<Appointment> {
    const response = await api.put(API_ROUTES.APPOINTMENTS.UPDATE(id), data);
    return response.data;
  },

  /**
   * Cancelar turno
   */
  async cancel(id: string, reason?: string): Promise<Appointment> {
    const response = await api.put(API_ROUTES.APPOINTMENTS.UPDATE(id), {
      status: 'CANCELLED',
      notes: reason,
    });
    return response.data;
  },

  /**
   * Marcar turno como completado
   */
  async complete(id: string): Promise<Appointment> {
    const response = await api.put(API_ROUTES.APPOINTMENTS.UPDATE(id), {
      status: 'COMPLETED',
    });
    return response.data;
  },

  /**
   * Marcar como no presentado
   */
  async markAsNoShow(id: string): Promise<Appointment> {
    const response = await api.put(API_ROUTES.APPOINTMENTS.UPDATE(id), {
      status: 'NO_SHOW',
    });
    return response.data;
  },

  /**
   * Eliminar turno
   */
  async delete(id: string): Promise<void> {
    await api.delete(API_ROUTES.APPOINTMENTS.DELETE(id));
  },

  /**
   * Obtener estadísticas del dashboard
   */
  async getStats(): Promise<DashboardStats> {
    const response = await api.get(API_ROUTES.APPOINTMENTS.STATS);
    return response.data;
  },
};

