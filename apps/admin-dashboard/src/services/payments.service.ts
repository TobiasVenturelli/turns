/**
 * @file payments.service.ts
 * @description Servicio para gestión de pagos y Mercado Pago
 * @author Turns Team
 * @created 2025-11-08
 */

import apiClient from '@/lib/axios';

export interface MercadoPagoAuthUrlResponse {
  authUrl: string;
  redirectUri: string;
}

export interface MercadoPagoStatusResponse {
  isConnected: boolean;
  mercadopagoUserId: string | null;
  mercadopagoEnabled: boolean;
}

export interface ConnectMercadoPagoData {
  code: string;
  redirectUri: string;
}

export const paymentsService = {
  /**
   * Obtener URL de autorización OAuth de Mercado Pago
   */
  async getMercadoPagoAuthUrl(businessId: string): Promise<MercadoPagoAuthUrlResponse> {
    const response = await apiClient.get<MercadoPagoAuthUrlResponse>(
      `/businesses/business/${businessId}/mercadopago/connect`
    );
    return response.data;
  },

  /**
   * Conectar cuenta de Mercado Pago (callback OAuth)
   */
  async connectMercadoPago(
    businessId: string,
    data: ConnectMercadoPagoData
  ): Promise<{ success: boolean; business: { id: string; name: string; mercadopagoEnabled: boolean } }> {
    const response = await apiClient.post(
      `/businesses/business/${businessId}/mercadopago/callback`,
      data
    );
    return response.data;
  },

  /**
   * Desconectar cuenta de Mercado Pago
   */
  async disconnectMercadoPago(
    businessId: string
  ): Promise<{ success: boolean; business: { id: string; name: string; mercadopagoEnabled: boolean } }> {
    const response = await apiClient.post(
      `/businesses/business/${businessId}/mercadopago/disconnect`
    );
    return response.data;
  },

  /**
   * Verificar estado de conexión de Mercado Pago
   */
  async getMercadoPagoStatus(businessId: string): Promise<MercadoPagoStatusResponse> {
    const response = await apiClient.get<MercadoPagoStatusResponse>(
      `/businesses/business/${businessId}/mercadopago/status`
    );
    return response.data;
  },
};

