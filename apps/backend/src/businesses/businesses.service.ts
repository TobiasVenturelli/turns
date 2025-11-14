/**
 * @file businesses.service.ts
 * @description Servicio para gestión de negocios
 * @author Turns Team
 * @created 2025-11-07
 */

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto, UpdateBusinessDto } from './dto';
import { MercadoPagoService } from '../payments/mercadopago.service';
import { ConfigService } from '@nestjs/config';
import qrcode from 'qrcode';
import slugify from 'slugify';

@Injectable()
export class BusinessesService {
  constructor(
    private prisma: PrismaService,
    private mercadoPagoService: MercadoPagoService,
    private configService: ConfigService,
  ) {}

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
        user: {
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
        user: {
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

  /**
   * Crear un nuevo negocio
   * @param userId - ID del usuario profesional
   * @param dto - Datos del negocio
   * @returns Negocio creado
   */
  async createBusiness(userId: string, dto: CreateBusinessDto) {
    // Verificar que el usuario no tenga ya un negocio
    const existingBusiness = await this.prisma.business.findUnique({
      where: { userId },
    });

    if (existingBusiness) {
      throw new ConflictException('El usuario ya tiene un negocio registrado');
    }

    // Generar slug único
    const slug = await this.generateUniqueSlug(dto.name);

    // Generar link compartible
    const shareableLink = `${process.env.WEB_URL || 'http://localhost:3001'}/${slug}`;

    // Crear negocio
    const business = await this.prisma.business.create({
      data: {
        ...dto,
        slug,
        shareableLink,
        userId,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Crear suscripción automática con trial de 7 días (Plan Pro - único plan disponible)
    const now = new Date();
    const trialEndsAt = new Date(now);
    trialEndsAt.setDate(trialEndsAt.getDate() + 7); // 7 días de trial

    // Obtener el plan Pro (único plan disponible)
    const proPlan = await this.prisma.subscriptionPlan.findFirst({
      where: { name: 'Pro' },
    });

    if (proPlan) {
      await this.prisma.subscription.create({
        data: {
          businessId: business.id,
          planId: proPlan.id,
          status: 'TRIAL',
          currentPeriodStart: now,
          currentPeriodEnd: trialEndsAt,
          trialEndsAt,
        },
      });
    }

    // Generar QR code
    await this.generateQRCode(business.id, shareableLink);

    return business;
  }

  /**
   * Actualizar negocio
   * @param id - ID del negocio
   * @param userId - ID del usuario (para verificar ownership)
   * @param dto - Datos a actualizar
   * @returns Negocio actualizado
   */
  async updateBusiness(id: string, userId: string, dto: UpdateBusinessDto) {
    // Verificar que el negocio existe y pertenece al usuario
    const business = await this.prisma.business.findFirst({
      where: { id, userId },
    });

    if (!business) {
      throw new NotFoundException('Negocio no encontrado o no tienes permisos');
    }

    // Si se cambia el nombre, generar nuevo slug
    const updates: Partial<UpdateBusinessDto> & {
      slug?: string;
      shareableLink?: string;
    } = { ...dto };

    if (dto.name && dto.name !== business.name) {
      const newSlug = await this.generateUniqueSlug(dto.name);
      updates.slug = newSlug;
      updates.shareableLink = `${process.env.WEB_URL || 'http://localhost:3001'}/${newSlug}`;

      // Regenerar QR code
      await this.generateQRCode(id, updates.shareableLink);
    }

    // Actualizar negocio
    const updatedBusiness = await this.prisma.business.update({
      where: { id },
      data: updates as UpdateBusinessDto & {
        slug?: string;
        shareableLink?: string;
      },
      include: {
        services: true,
        schedules: true,
      },
    });

    return updatedBusiness;
  }

  /**
   * Eliminar negocio (soft delete)
   * @param id - ID del negocio
   * @param userId - ID del usuario
   */
  async deleteBusiness(id: string, userId: string) {
    // Verificar ownership
    const business = await this.prisma.business.findFirst({
      where: { id, userId },
    });

    if (!business) {
      throw new NotFoundException('Negocio no encontrado o no tienes permisos');
    }

    // Soft delete: marcar como inactivo
    await this.prisma.business.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Negocio desactivado correctamente' };
  }

  /**
   * Obtener negocio por ID (para profesional)
   * @param id - ID del negocio
   * @param userId - ID del usuario
   * @returns Detalles del negocio
   */
  async getBusinessById(id: string, userId: string) {
    const business = await this.prisma.business.findFirst({
      where: { id, userId },
      include: {
        services: {
          orderBy: { name: 'asc' },
        },
        schedules: {
          orderBy: { dayOfWeek: 'asc' },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!business) {
      throw new NotFoundException('Negocio no encontrado o no tienes permisos');
    }

    return business;
  }

  /**
   * Obtener negocio del usuario autenticado
   * @param userId - ID del usuario
   * @returns Negocio del usuario
   */
  async getMyBusiness(userId: string) {
    const business = await this.prisma.business.findUnique({
      where: { userId },
      include: {
        services: {
          orderBy: { name: 'asc' },
        },
        schedules: {
          orderBy: { dayOfWeek: 'asc' },
        },
        _count: {
          select: {
            appointments: true,
            services: true,
          },
        },
      },
    });

    if (!business) {
      throw new NotFoundException('No tienes un negocio registrado');
    }

    return business;
  }

  /**
   * Actualizar logo del negocio
   * @param id - ID del negocio
   * @param userId - ID del usuario
   * @param logoUrl - URL del logo subido
   * @returns Negocio actualizado
   */
  async updateLogo(id: string, userId: string, logoUrl: string) {
    const business = await this.prisma.business.findFirst({
      where: { id, userId },
    });

    if (!business) {
      throw new NotFoundException('Negocio no encontrado o no tienes permisos');
    }

    return this.prisma.business.update({
      where: { id },
      data: { logo: logoUrl },
    });
  }

  /**
   * Generar slug único a partir del nombre
   * @param name - Nombre del negocio
   * @returns Slug único
   */
  private async generateUniqueSlug(name: string): Promise<string> {
    const slug = slugify(name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });

    // Verificar si el slug ya existe
    let counter = 1;
    let uniqueSlug = slug;
    let exists = await this.prisma.business.findUnique({
      where: { slug: uniqueSlug },
    });

    while (exists) {
      uniqueSlug = `${slug}-${counter}`;
      exists = await this.prisma.business.findUnique({
        where: { slug: uniqueSlug },
      });
      counter++;
    }

    return uniqueSlug;
  }

  /**
   * Generar código QR para el negocio
   * @param businessId - ID del negocio
   * @param url - URL del negocio
   */
  private async generateQRCode(businessId: string, url: string) {
    try {
      // Generar QR code como Data URL
      const qrCodeDataUrl = await qrcode.toDataURL(url, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        width: 300,
        margin: 2,
      });

      // Actualizar el negocio con el QR code
      await this.prisma.business.update({
        where: { id: businessId },
        data: { qrCodeUrl: qrCodeDataUrl },
      });
    } catch (error) {
      console.error('Error generando QR code:', error);
      // No lanzar error, el QR no es crítico
    }
  }

  /**
   * Obtener QR code del negocio
   * @param id - ID del negocio
   * @param userId - ID del usuario
   * @returns QR code data URL
   */
  async getQRCode(id: string, userId: string) {
    const business = await this.prisma.business.findFirst({
      where: { id, userId },
      select: { qrCodeUrl: true, shareableLink: true },
    });

    if (!business) {
      throw new NotFoundException('Negocio no encontrado o no tienes permisos');
    }

    if (!business.qrCodeUrl) {
      // Generar QR si no existe
      await this.generateQRCode(id, business.shareableLink);
      const updated = await this.prisma.business.findUnique({
        where: { id },
        select: { qrCodeUrl: true },
      });
      return updated?.qrCodeUrl;
    }

    return business.qrCodeUrl;
  }

  /**
   * Obtener URL de autorización OAuth de Mercado Pago
   * @param id - ID del negocio
   * @param userId - ID del usuario
   * @returns URL de autorización
   */
  async getMercadoPagoAuthUrl(id: string, userId: string) {
    const business = await this.prisma.business.findFirst({
      where: { id, userId },
    });

    if (!business) {
      throw new NotFoundException('Negocio no encontrado o no tienes permisos');
    }

    const adminUrl =
      this.configService.get<string>('ADMIN_URL') || 'http://localhost:3002';
    const redirectUri = `${adminUrl}/dashboard/configuracion/pagos/callback`;

    const authUrl =
      this.mercadoPagoService.getOAuthAuthorizationUrl(redirectUri);

    return {
      authUrl,
      redirectUri,
    };
  }

  /**
   * Conectar cuenta de Mercado Pago (callback OAuth)
   * @param id - ID del negocio
   * @param userId - ID del usuario
   * @param code - Código de autorización
   * @param redirectUri - URI de redirección
   * @returns Negocio actualizado
   */
  async connectMercadoPago(
    id: string,
    userId: string,
    code: string,
    redirectUri: string,
  ) {
    const business = await this.prisma.business.findFirst({
      where: { id, userId },
    });

    if (!business) {
      throw new NotFoundException('Negocio no encontrado o no tienes permisos');
    }

    try {
      // Intercambiar código por tokens
      const tokens = await this.mercadoPagoService.exchangeAuthorizationCode(
        code,
        redirectUri,
      );

      // Actualizar negocio con tokens
      const updated = await this.prisma.business.update({
        where: { id },
        data: {
          mercadopagoAccessToken: tokens.access_token,
          mercadopagoRefreshToken: tokens.refresh_token,
          mercadopagoUserId: tokens.user_id,
          mercadopagoEnabled: true,
        },
      });

      return {
        success: true,
        business: {
          id: updated.id,
          name: updated.name,
          mercadopagoEnabled: updated.mercadopagoEnabled,
          mercadopagoUserId: updated.mercadopagoUserId,
        },
      };
    } catch (error: unknown) {
      console.error('Error connecting Mercado Pago:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(
        `Error al conectar Mercado Pago: ${errorMessage}`,
      );
    }
  }

  /**
   * Desconectar cuenta de Mercado Pago
   * @param id - ID del negocio
   * @param userId - ID del usuario
   * @returns Negocio actualizado
   */
  async disconnectMercadoPago(id: string, userId: string) {
    const business = await this.prisma.business.findFirst({
      where: { id, userId },
    });

    if (!business) {
      throw new NotFoundException('Negocio no encontrado o no tienes permisos');
    }

    // Actualizar negocio para deshabilitar Mercado Pago
    const updated = await this.prisma.business.update({
      where: { id },
      data: {
        mercadopagoAccessToken: null,
        mercadopagoRefreshToken: null,
        mercadopagoUserId: null,
        mercadopagoEnabled: false,
      },
    });

    return {
      success: true,
      business: {
        id: updated.id,
        name: updated.name,
        mercadopagoEnabled: updated.mercadopagoEnabled,
      },
    };
  }

  /**
   * Verificar estado de conexión de Mercado Pago
   * @param id - ID del negocio
   * @param userId - ID del usuario
   * @returns Estado de conexión
   */
  async getMercadoPagoStatus(id: string, userId: string) {
    const business = await this.prisma.business.findFirst({
      where: { id, userId },
      select: {
        id: true,
        name: true,
        mercadopagoEnabled: true,
        mercadopagoUserId: true,
        mercadopagoAccessToken: true,
      },
    });

    if (!business) {
      throw new NotFoundException('Negocio no encontrado o no tienes permisos');
    }

    return {
      isConnected:
        business.mercadopagoEnabled && !!business.mercadopagoAccessToken,
      mercadopagoUserId: business.mercadopagoUserId,
      mercadopagoEnabled: business.mercadopagoEnabled,
    };
  }
}
