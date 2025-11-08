/**
 * @file businesses.controller.ts
 * @description Controlador de endpoints de negocios (públicos y protegidos)
 * @author Turns Team
 * @created 2025-11-07
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateBusinessDto, UpdateBusinessDto } from './dto';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  // ===========================================
  // ENDPOINTS PÚBLICOS
  // ===========================================

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
    // Evitar colisiones con rutas protegidas
    if (slug === 'my-business') {
      return null;
    }
    return this.businessesService.getBusinessBySlug(slug);
  }

  // ===========================================
  // ENDPOINTS PROTEGIDOS (Profesionales)
  // ===========================================

  /**
   * Obtener mi negocio (profesional autenticado)
   * @param userId - ID del usuario autenticado
   * @returns Mi negocio
   */
  @Get('my-business')
  async getMyBusiness(@CurrentUser('id') userId: string) {
    return this.businessesService.getMyBusiness(userId);
  }

  /**
   * Crear un nuevo negocio
   * @param userId - ID del usuario autenticado
   * @param dto - Datos del negocio
   * @returns Negocio creado
   */
  @Post()
  async createBusiness(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateBusinessDto,
  ) {
    return this.businessesService.createBusiness(userId, dto);
  }

  /**
   * Obtener negocio por ID (profesional)
   * @param id - ID del negocio
   * @param userId - ID del usuario autenticado
   * @returns Detalles del negocio
   */
  @Get('business/:id')
  async getBusinessById(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.businessesService.getBusinessById(id, userId);
  }

  /**
   * Actualizar negocio
   * @param id - ID del negocio
   * @param userId - ID del usuario autenticado
   * @param dto - Datos a actualizar
   * @returns Negocio actualizado
   */
  @Put('business/:id')
  async updateBusiness(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateBusinessDto,
  ) {
    return this.businessesService.updateBusiness(id, userId, dto);
  }

  /**
   * Eliminar negocio (soft delete)
   * @param id - ID del negocio
   * @param userId - ID del usuario autenticado
   */
  @Delete('business/:id')
  async deleteBusiness(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.businessesService.deleteBusiness(id, userId);
  }

  /**
   * Obtener código QR del negocio
   * @param id - ID del negocio
   * @param userId - ID del usuario autenticado
   * @returns QR code data URL
   */
  @Get('business/:id/qr-code')
  async getQRCode(@Param('id') id: string, @CurrentUser('id') userId: string) {
    const qrCodeUrl = await this.businessesService.getQRCode(id, userId);
    return { qrCodeUrl };
  }

  /**
   * Actualizar logo del negocio
   * @param id - ID del negocio
   * @param userId - ID del usuario autenticado
   * @param body - URL del logo
   * @returns Negocio actualizado
   */
  @Post('business/:id/logo')
  async updateLogo(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body('logoUrl') logoUrl: string,
  ) {
    return this.businessesService.updateLogo(id, userId, logoUrl);
  }
}
