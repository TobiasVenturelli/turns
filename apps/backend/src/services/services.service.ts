/**
 * @file services.service.ts
 * @description Servicio para gestión de servicios del negocio
 * @author Turns Team
 * @created 2025-11-08
 */

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crear un nuevo servicio
   * @param businessId - ID del negocio
   * @param userId - ID del usuario (para verificar ownership)
   * @param dto - Datos del servicio
   * @returns Servicio creado
   */
  async createService(
    businessId: string,
    userId: string,
    dto: CreateServiceDto,
  ) {
    // Verificar que el negocio existe y pertenece al usuario
    const business = await this.prisma.business.findFirst({
      where: { id: businessId, userId },
    });

    if (!business) {
      throw new NotFoundException('Negocio no encontrado o no tienes permisos');
    }

    // Crear servicio
    const service = await this.prisma.service.create({
      data: {
        ...dto,
        businessId,
      },
    });

    return service;
  }

  /**
   * Obtener todos los servicios de un negocio
   * @param businessId - ID del negocio
   * @param userId - ID del usuario (opcional, para filtrar por ownership)
   * @returns Lista de servicios
   */
  async getServicesByBusiness(businessId: string, userId?: string) {
    // Si se proporciona userId, verificar ownership
    if (userId) {
      const business = await this.prisma.business.findFirst({
        where: { id: businessId, userId },
      });

      if (!business) {
        throw new ForbiddenException('No tienes acceso a este negocio');
      }

      // Retornar todos los servicios (incluso inactivos) para el dueño
      return this.prisma.service.findMany({
        where: { businessId },
        orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
      });
    }

    // Público: solo servicios activos
    return this.prisma.service.findMany({
      where: {
        businessId,
        isActive: true,
      },
      orderBy: { price: 'asc' },
    });
  }

  /**
   * Obtener un servicio por ID
   * @param id - ID del servicio
   * @param userId - ID del usuario (para verificar ownership)
   * @returns Servicio encontrado
   */
  async getServiceById(id: string, userId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        business: {
          select: {
            userId: true,
            name: true,
          },
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    // Verificar ownership
    if (service.business.userId !== userId) {
      throw new ForbiddenException('No tienes permisos para este servicio');
    }

    return service;
  }

  /**
   * Actualizar servicio
   * @param id - ID del servicio
   * @param userId - ID del usuario
   * @param dto - Datos a actualizar
   * @returns Servicio actualizado
   */
  async updateService(id: string, userId: string, dto: UpdateServiceDto) {
    // Verificar que el servicio existe y el usuario tiene permisos
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        business: {
          select: { userId: true },
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    if (service.business.userId !== userId) {
      throw new ForbiddenException('No tienes permisos para este servicio');
    }

    // Actualizar servicio
    const updatedService = await this.prisma.service.update({
      where: { id },
      data: dto,
    });

    return updatedService;
  }

  /**
   * Eliminar servicio (soft delete)
   * @param id - ID del servicio
   * @param userId - ID del usuario
   */
  async deleteService(id: string, userId: string) {
    // Verificar ownership
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        business: {
          select: { userId: true },
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    if (service.business.userId !== userId) {
      throw new ForbiddenException('No tienes permisos para este servicio');
    }

    // Soft delete: marcar como inactivo
    await this.prisma.service.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Servicio desactivado correctamente' };
  }

  /**
   * Activar/desactivar servicio
   * @param id - ID del servicio
   * @param userId - ID del usuario
   * @param isActive - Estado del servicio
   * @returns Servicio actualizado
   */
  async toggleServiceStatus(id: string, userId: string, isActive: boolean) {
    // Verificar ownership
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        business: {
          select: { userId: true },
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    if (service.business.userId !== userId) {
      throw new ForbiddenException('No tienes permisos para este servicio');
    }

    // Actualizar estado
    return this.prisma.service.update({
      where: { id },
      data: { isActive },
    });
  }
}
