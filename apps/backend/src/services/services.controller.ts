/**
 * @file services.controller.ts
 * @description Controlador de endpoints de servicios
 * @author Turns Team
 * @created 2025-11-08
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateServiceDto, UpdateServiceDto } from './dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // ===========================================
  // ENDPOINTS PROTEGIDOS (Profesionales)
  // ===========================================

  /**
   * Crear un nuevo servicio
   * @param businessId - ID del negocio (query param o body)
   * @param userId - ID del usuario autenticado
   * @param dto - Datos del servicio
   * @returns Servicio creado
   */
  @Post('business/:businessId')
  async createService(
    @Param('businessId') businessId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateServiceDto,
  ) {
    return this.servicesService.createService(businessId, userId, dto);
  }

  /**
   * Obtener servicios del negocio (profesional)
   * @param businessId - ID del negocio
   * @param userId - ID del usuario autenticado
   * @returns Lista de servicios (incluyendo inactivos)
   */
  @Get('business/:businessId/my-services')
  async getMyServices(
    @Param('businessId') businessId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.servicesService.getServicesByBusiness(businessId, userId);
  }

  /**
   * Obtener un servicio por ID
   * @param id - ID del servicio
   * @param userId - ID del usuario autenticado
   * @returns Servicio encontrado
   */
  @Get(':id')
  async getServiceById(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.servicesService.getServiceById(id, userId);
  }

  /**
   * Actualizar servicio
   * @param id - ID del servicio
   * @param userId - ID del usuario autenticado
   * @param dto - Datos a actualizar
   * @returns Servicio actualizado
   */
  @Put(':id')
  async updateService(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.servicesService.updateService(id, userId, dto);
  }

  /**
   * Eliminar servicio (soft delete)
   * @param id - ID del servicio
   * @param userId - ID del usuario autenticado
   */
  @Delete(':id')
  async deleteService(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.servicesService.deleteService(id, userId);
  }

  /**
   * Activar/desactivar servicio
   * @param id - ID del servicio
   * @param userId - ID del usuario autenticado
   * @param body - Estado del servicio
   * @returns Servicio actualizado
   */
  @Patch(':id/toggle')
  async toggleServiceStatus(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.servicesService.toggleServiceStatus(id, userId, isActive);
  }

  // ===========================================
  // ENDPOINTS PÚBLICOS
  // ===========================================

  /**
   * Obtener servicios activos de un negocio (público)
   * @param businessId - ID del negocio
   * @returns Lista de servicios activos
   */
  @Public()
  @Get('business/:businessId')
  async getPublicServices(@Param('businessId') businessId: string) {
    return this.servicesService.getServicesByBusiness(businessId);
  }
}
