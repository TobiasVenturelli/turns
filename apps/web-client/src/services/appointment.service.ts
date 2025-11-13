/**
 * @file appointment.service.ts
 * @description Servicio de API para citas
 * @author Turns Team
 * @created 2025-11-07
 */

import apiClient from '@/config/api';
import type { Appointment, AppointmentWithRelations } from '@/types';

export interface AvailableSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface CreateAppointmentData {
  businessId: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  notes?: string;
  customerId?: string;
  // Información de invitado (si no está autenticado)
  guestFirstName?: string;
  guestLastName?: string;
  guestEmail?: string;
  guestPhone?: string;
}

export interface GetAppointmentsFilters {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  from?: string; // ISO date
  to?: string; // ISO date
  businessId?: string; // Filtrar por negocio específico
  businessSlug?: string; // Filtrar por slug del negocio
}

export interface CancelAppointmentData {
  reason?: string;
}

export const appointmentService = {
  /**
   * Obtener slots disponibles
   */
  async getAvailableSlots(
    businessId: string,
    serviceId: string,
    date: string, // YYYY-MM-DD
  ): Promise<AvailableSlot[]> {
    const response = await apiClient.get<AvailableSlot[]>('/appointments/available-slots', {
      params: { businessId, serviceId, date },
    });
    return response.data;
  },

  /**
   * Crear una cita
   */
  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    const response = await apiClient.post<Appointment>('/appointments', data);
    return response.data;
  },

  /**
   * Obtener mis citas
   */
  async getMyAppointments(filters?: GetAppointmentsFilters): Promise<AppointmentWithRelations[]> {
    const response = await apiClient.get<AppointmentWithRelations[]>('/appointments/my-appointments', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Obtener una cita por ID
   */
  async getAppointmentById(appointmentId: string): Promise<AppointmentWithRelations> {
    const response = await apiClient.get<AppointmentWithRelations>(`/appointments/${appointmentId}`);
    return response.data;
  },

  /**
   * Cancelar una cita
   */
  async cancelAppointment(appointmentId: string, data?: CancelAppointmentData): Promise<Appointment> {
    const response = await apiClient.post<Appointment>(`/appointments/${appointmentId}/cancel`, data);
    return response.data;
  },

  /**
   * Reprogramar una cita
   */
  async rescheduleAppointment(
    appointmentId: string,
    data: { startTime: string; endTime: string }
  ): Promise<Appointment> {
    const response = await apiClient.post<Appointment>(`/appointments/${appointmentId}/reschedule`, data);
    return response.data;
  },
};

