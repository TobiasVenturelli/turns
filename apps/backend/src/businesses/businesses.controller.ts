/**
 * @file businesses.controller.ts
 * @description Controlador de endpoints públicos de negocios
 * @author Turns Team
 * @created 2025-11-07
 */

import { Controller, Get, Param, Query } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  /**
   * Obtener todos los negocios (público)
   * @returns Lista de negocios activos
   */
  @Public()
  @Get()
  async getAllBusinesses(@Query('search') search?: string) {
    if (search) {
      return this.businessesService.searchBusinesses(search);
    }
    return this.businessesService.getAllBusinesses();
  }

  /**
   * Obtener negocio por slug (público)
   * @param slug - Slug del negocio
   * @returns Detalles completos del negocio
   */
  @Public()
  @Get(':slug')
  async getBusinessBySlug(@Param('slug') slug: string) {
    return this.businessesService.getBusinessBySlug(slug);
  }
}
