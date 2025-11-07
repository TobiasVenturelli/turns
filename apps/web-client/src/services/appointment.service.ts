/**
 * @file appointment.service.ts
 * @description Servicio de API para citas
 * @author Turns Team
 * @created 2025-11-07
 */

import apiClient from '@/config/api';
import type { Appointment } from '@/types';

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
  async getMyAppointments(): Promise<Appointment[]> {
    const response = await apiClient.get<Appointment[]>('/appointments/my-appointments');
    return response.data;
  },

  /**
   * Cancelar una cita
   */
  async cancelAppointment(appointmentId: string): Promise<Appointment> {
    const response = await apiClient.post<Appointment>(`/appointments/${appointmentId}/cancel`);
    return response.data;
  },
};

