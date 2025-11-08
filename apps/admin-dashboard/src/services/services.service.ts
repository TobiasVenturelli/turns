/**
 * @file services.service.ts
 * @description Servicio de gestión de servicios
 */

import api from '@/lib/axios';
import { API_ROUTES } from '@/config/api';
import { Service, CreateServiceDto, UpdateServiceDto } from '@/types';

export const servicesService = {
  /**
   * Obtener todos los servicios del negocio
   */
  async getAll(businessId: string): Promise<Service[]> {
    const response = await api.get(API_ROUTES.SERVICES.LIST(businessId));
    return response.data;
  },

  /**
   * Crear servicio
   */
  async create(data: CreateServiceDto): Promise<Service> {
    const response = await api.post(API_ROUTES.SERVICES.CREATE, data);
    return response.data;
  },

  /**
   * Actualizar servicio
   */
  async update(id: string, data: UpdateServiceDto): Promise<Service> {
    const response = await api.put(API_ROUTES.SERVICES.UPDATE(id), data);
    return response.data;
  },

  /**
   * Eliminar servicio
   */
  async delete(id: string): Promise<void> {
    await api.delete(API_ROUTES.SERVICES.DELETE(id));
  },

  /**
   * Activar/desactivar servicio
   */
  async toggleActive(id: string, isActive: boolean): Promise<Service> {
    const response = await api.put(API_ROUTES.SERVICES.UPDATE(id), {
      isActive,
    });
    return response.data;
  },
};

