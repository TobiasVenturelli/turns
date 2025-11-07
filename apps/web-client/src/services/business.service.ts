/**
 * @file business.service.ts
 * @description Servicio de API para negocios
 * @author Turns Team
 * @created 2025-11-07
 */

import apiClient from '@/config/api';
import type { Business, BusinessWithRelations } from '@/types';

export const businessService = {
  /**
   * Obtener todos los negocios
   */
  async getAllBusinesses(search?: string): Promise<Business[]> {
    const params = search ? { search } : {};
    const response = await apiClient.get<Business[]>('/businesses', { params });
    return response.data;
  },

  /**
   * Obtener negocio por slug
   */
  async getBusinessBySlug(slug: string): Promise<BusinessWithRelations> {
    const response = await apiClient.get<BusinessWithRelations>(`/businesses/${slug}`);
    return response.data;
  },
};

