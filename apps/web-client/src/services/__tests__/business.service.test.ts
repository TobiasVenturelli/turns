/**
 * @file business.service.test.ts
 * @description Tests para el servicio de negocios
 * @author Turns Team
 * @created 2025-11-08
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { businessService } from '../business.service';
import apiClient from '@/config/api';
import { mockBusiness } from '@/test/mockData';

// Mock del apiClient
vi.mock('@/config/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('businessService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllBusinesses', () => {
    it('debe obtener todos los negocios', async () => {
      const mockResponse = { data: [mockBusiness] };
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await businessService.getAllBusinesses();

      expect(apiClient.get).toHaveBeenCalledWith('/businesses', {
        params: {},
      });
      expect(result).toEqual([mockBusiness]);
    });

    it('debe buscar negocios con parámetro search', async () => {
      const mockResponse = { data: [mockBusiness] };
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      await businessService.getAllBusinesses('peluquería');

      expect(apiClient.get).toHaveBeenCalledWith('/businesses', {
        params: { search: 'peluquería' },
      });
    });
  });

  describe('getBusinessBySlug', () => {
    it('debe obtener un negocio por slug', async () => {
      const mockResponse = { data: mockBusiness };
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await businessService.getBusinessBySlug('peluqueria-maria');

      expect(apiClient.get).toHaveBeenCalledWith('/businesses/peluqueria-maria');
      expect(result).toEqual(mockBusiness);
    });
  });
});

