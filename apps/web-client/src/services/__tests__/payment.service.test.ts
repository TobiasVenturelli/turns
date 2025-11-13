/**
 * @file payment.service.test.ts
 * @description Tests para el servicio de pagos
 * @author Turns Team
 * @created 2025-11-13
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { paymentService } from '../payment.service';
import apiClient from '@/config/api';

// Mock del apiClient
vi.mock('@/config/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('paymentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createPaymentPreference', () => {
    it('debe crear una preferencia de pago', async () => {
      const mockResponse = {
        data: {
          preferenceId: 'pref-123',
          initPoint: 'https://mp.com/init',
          sandboxInitPoint: 'https://mp.com/sandbox',
          appointmentId: 'appointment-1',
          amount: 1000,
          currency: 'ARS',
        },
      };
      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await paymentService.createPaymentPreference('appointment-1', {
        amount: 1000,
        description: 'Test Payment',
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        '/payments/appointments/appointment-1/create-preference',
        {
          amount: 1000,
          description: 'Test Payment',
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getPaymentStatus', () => {
    it('debe obtener el estado de un pago', async () => {
      const mockResponse = {
        data: {
          status: 'approved',
          amount: 1000,
          paymentMethod: 'credit_card',
        },
      };
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await paymentService.getPaymentStatus('payment-123');

      expect(apiClient.get).toHaveBeenCalledWith('/payments/payment-123/status');
      expect(result).toEqual(mockResponse.data);
    });
  });
});

