/**
 * @file business.service.ts
 * @description Servicio de gestión de negocio
 */

import api from '@/lib/axios';
import { API_ROUTES } from '@/config/api';
import { Business } from '@/types';

export const businessService = {
  /**
   * Obtener negocio del profesional
   */
  async getMyBusiness(): Promise<Business> {
    const response = await api.get(API_ROUTES.BUSINESS.MY_BUSINESS);
    return response.data;
  },

  /**
   * Actualizar información del negocio
   */
  async update(data: Partial<Business>): Promise<Business> {
    const response = await api.put(API_ROUTES.BUSINESS.UPDATE, data);
    return response.data;
  },

  /**
   * Subir logo
   */
  async uploadLogo(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await api.post(API_ROUTES.BUSINESS.UPLOAD_LOGO, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Subir fotos del local
   */
  async uploadPhotos(files: File[]): Promise<{ urls: string[] }> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('photos', file);
    });

    const response = await api.post(
      API_ROUTES.BUSINESS.UPLOAD_PHOTOS,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};

