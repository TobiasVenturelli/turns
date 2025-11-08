/**
 * @file customers.service.ts
 * @description Servicio de gestión de clientes
 */

import api from '@/lib/axios';
import { API_ROUTES } from '@/config/api';
import { User } from '@/types';

export const customersService = {
  /**
   * Obtener todos los clientes del profesional
   */
  async getAll(params?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ customers: User[]; total: number }> {
    const response = await api.get(API_ROUTES.CUSTOMERS.LIST, { params });
    return response.data;
  },

  /**
   * Obtener detalles de un cliente
   */
  async getById(id: string): Promise<User> {
    const response = await api.get(API_ROUTES.CUSTOMERS.GET(id));
    return response.data;
  },
};

