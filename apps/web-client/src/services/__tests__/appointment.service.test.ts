/**
 * @file appointment.service.test.ts
 * @description Tests para el servicio de citas
 * @author Turns Team
 * @created 2025-11-08
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appointmentService } from '../appointment.service';
import apiClient from '@/config/api';
import { mockAppointment } from '@/test/mockData';

// Mock del apiClient
vi.mock('@/config/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('appointmentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAvailableSlots', () => {
    it('debe obtener slots disponibles', async () => {
      const mockSlots = [
        { startTime: '09:00', endTime: '09:30', available: true },
        { startTime: '10:00', endTime: '10:30', available: true },
        { startTime: '11:00', endTime: '11:30', available: false },
      ];
      const mockResponse = { data: mockSlots };
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await appointmentService.getAvailableSlots(
        'business-1',
        'service-1',
        '2025-11-15',
      );

      expect(apiClient.get).toHaveBeenCalledWith('/appointments/available-slots', {
        params: {
          businessId: 'business-1',
          serviceId: 'service-1',
          date: '2025-11-15',
        },
      });
      expect(result).toEqual(mockSlots);
    });
  });

  describe('createAppointment', () => {
    it('debe crear una cita', async () => {
      const appointmentData = {
        businessId: 'business-1',
        serviceId: 'service-1',
        startTime: '2025-11-15T10:00:00Z',
        endTime: '2025-11-15T10:30:00Z',
        notes: 'Nota de prueba',
      };
      const mockResponse = { data: mockAppointment };
      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await appointmentService.createAppointment(appointmentData);

      expect(apiClient.post).toHaveBeenCalledWith('/appointments', appointmentData);
      expect(result).toEqual(mockAppointment);
    });
  });

  describe('getMyAppointments', () => {
    it('debe obtener las citas del usuario', async () => {
      const mockResponse = { data: [mockAppointment] };
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await appointmentService.getMyAppointments();

      expect(apiClient.get).toHaveBeenCalledWith('/appointments/my-appointments');
      expect(result).toEqual([mockAppointment]);
    });
  });

  describe('cancelAppointment', () => {
    it('debe cancelar una cita', async () => {
      const cancelledAppointment = { ...mockAppointment, status: 'CANCELLED' };
      const mockResponse = { data: cancelledAppointment };
      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await appointmentService.cancelAppointment('appointment-1');

      expect(apiClient.post).toHaveBeenCalledWith('/appointments/appointment-1/cancel');
      expect(result).toEqual(cancelledAppointment);
    });
  });
});

