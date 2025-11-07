/**
 * @file businesses.service.ts
 * @description Servicio para gestión de negocios
 * @author Turns Team
 * @created 2025-11-07
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BusinessesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtener negocio por slug (público)
   * @param slug - Slug del negocio
   * @returns Negocio con servicios y horarios
   */
  async getBusinessBySlug(slug: string) {
    const business = await this.prisma.business.findUnique({
      where: { slug },
      include: {
        services: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
        },
        schedules: {
          orderBy: { dayOfWeek: 'asc' },
        },
        owner: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    if (!business) {
      throw new NotFoundException('Negocio no encontrado');
    }

    return business;
  }

  /**
   * Listar todos los negocios activos (público)
   * @returns Lista de negocios
   */
  async getAllBusinesses() {
    const businesses = await this.prisma.business.findMany({
      where: { isActive: true },
      include: {
        services: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
          },
        },
        owner: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return businesses;
  }

  /**
   * Buscar negocios por nombre o ciudad
   * @param query - Término de búsqueda
   * @returns Negocios encontrados
   */
  async searchBusinesses(query: string) {
    const businesses = await this.prisma.business.findMany({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { city: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
      include: {
        services: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            price: true,
          },
          take: 3,
        },
      },
      take: 20,
    });

    return businesses;
  }
}
