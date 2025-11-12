/**
 * @file payment.service.ts
 * @description Servicio para gestión de pagos con Mercado Pago
 * @author Turns Team
 * @created 2025-11-08
 */

import apiClient from '@/config/api';

export interface CreatePaymentPreferenceData {
  appointmentId: string;
  amount: number;
  currency?: string;
  description?: string;
}

export interface PaymentPreferenceResponse {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
  appointmentId: string;
  amount: number;
  currency: string;
}

export interface PaymentStatusResponse {
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded';
  amount: number;
  paymentMethod: string;
}

export const paymentService = {
  /**
   * Crear preferencia de pago para un turno
   */
  async createPaymentPreference(
    appointmentId: string,
    data: Omit<CreatePaymentPreferenceData, 'appointmentId'>
  ): Promise<PaymentPreferenceResponse> {
    const response = await apiClient.post<PaymentPreferenceResponse>(
      `/payments/appointments/${appointmentId}/create-preference`,
      data
    );
    return response.data;
  },

  /**
   * Obtener estado de un pago
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    const response = await apiClient.get<PaymentStatusResponse>(
      `/payments/${paymentId}/status`
    );
    return response.data;
  },
};

