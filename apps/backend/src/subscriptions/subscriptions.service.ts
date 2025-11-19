import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';
import { MercadoPagoService } from '../payments/mercadopago.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubscriptionsService {
  constructor(
    private prisma: PrismaService,
    private mercadoPagoService: MercadoPagoService,
    private configService: ConfigService,
  ) {}

  /**
   * Obtener todos los planes de suscripción disponibles
   * Solo hay un plan: Pro
   */
  async getPlans() {
    return this.prisma.subscriptionPlan.findMany({
      where: { name: 'Pro', isActive: true },
    });
  }

  /**
   * Obtener un plan específico por ID
   */
  async getPlanById(planId: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException('Plan de suscripción no encontrado');
    }

    return plan;
  }

  /**
   * Obtener la suscripción actual de un negocio
   */
  async getCurrentSubscription(businessId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { businessId },

      include: { plan: true },
    });

    if (!subscription) {
      throw new NotFoundException(
        'No se encontró suscripción para este negocio',
      );
    }

    // Verificar si el trial expiró
    if (
      subscription.status === SubscriptionStatus.TRIAL &&
      subscription.trialEndsAt &&
      new Date() > subscription.trialEndsAt
    ) {
      // Actualizar estado a EXPIRED
      return this.prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: SubscriptionStatus.EXPIRED },

        include: { plan: true },
      });
    }

    return subscription;
  }

  /**
   * Crear una nueva suscripción para un negocio
   * Se crea automáticamente con trial de 7 días (Plan Pro)
   * Este método ya no se usa directamente, la suscripción se crea automáticamente al registrar
   */
  async createSubscription(businessId: string) {
    // Verificar que el negocio existe
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Negocio no encontrado');
    }

    // Verificar que no tenga ya una suscripción
    const existingSubscription = await this.prisma.subscription.findUnique({
      where: { businessId },
    });

    if (existingSubscription) {
      throw new ConflictException('Este negocio ya tiene una suscripción');
    }

    // Obtener el plan Pro (único plan disponible)

    const proPlan = await this.prisma.subscriptionPlan.findFirst({
      where: { name: 'Pro' },
    });

    if (!proPlan) {
      throw new NotFoundException('Plan Pro no encontrado');
    }

    // Crear suscripción con trial de 7 días
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);

    return this.prisma.subscription.create({
      data: {
        businessId,

        planId: proPlan.id,
        status: SubscriptionStatus.TRIAL,
        currentPeriodStart: new Date(),
        currentPeriodEnd: trialEndDate,
        trialEndsAt: trialEndDate,
      },

      include: { plan: true },
    });
  }

  /**
   * Cambiar el plan de suscripción
   */
  async changePlan(businessId: string, newPlanId: string) {
    const subscription = await this.getCurrentSubscription(businessId);

    // Verificar que el nuevo plan existe
    const newPlan = await this.getPlanById(newPlanId);

    // No permitir cambio si está en trial
    if (subscription.status === SubscriptionStatus.TRIAL) {
      throw new BadRequestException(
        'No se puede cambiar de plan durante el período de prueba',
      );
    }

    // No permitir cambio si está expirado
    if (subscription.status === SubscriptionStatus.EXPIRED) {
      throw new BadRequestException(
        'No se puede cambiar de plan con suscripción expirada. Reactive primero su suscripción.',
      );
    }

    // Actualizar plan
    return this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        planId: newPlan.id,
        // El cambio se aplica inmediatamente
        // En producción, esto debería coordinar con Mercado Pago
      },

      include: { plan: true },
    });
  }

  /**
   * Cancelar suscripción (se cancela al final del período)
   */
  async cancelSubscription(businessId: string) {
    const subscription = await this.getCurrentSubscription(businessId);

    if (subscription.status === SubscriptionStatus.EXPIRED) {
      throw new BadRequestException('La suscripción ya está expirada');
    }

    if (subscription.status === SubscriptionStatus.CANCELLED) {
      throw new BadRequestException('La suscripción ya está cancelada');
    }

    return this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: SubscriptionStatus.CANCELLED,

        cancelAtPeriodEnd: true,
      },

      include: { plan: true },
    });
  }

  /**
   * Reactivar una suscripción cancelada
   */
  async reactivateSubscription(businessId: string) {
    const subscription = await this.getCurrentSubscription(businessId);

    if (subscription.status !== SubscriptionStatus.CANCELLED) {
      throw new BadRequestException(
        'Solo se pueden reactivar suscripciones canceladas',
      );
    }

    return this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: SubscriptionStatus.ACTIVE,

        cancelAtPeriodEnd: false,
      },

      include: { plan: true },
    });
  }

  /**
   * Activar suscripción después del trial (llamado por webhook de Mercado Pago)
   */
  async activateSubscription(
    businessId: string,
    mercadopagoSubscriptionId: string,
  ) {
    const subscription = await this.getCurrentSubscription(businessId);

    // Calcular próximo período (1 mes)
    const nextPeriodStart = new Date();
    const nextPeriodEnd = new Date();
    nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + 1);

    return this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: SubscriptionStatus.ACTIVE,
        mercadopagoSubscriptionId,
        currentPeriodStart: nextPeriodStart,
        currentPeriodEnd: nextPeriodEnd,
        trialEndsAt: null, // Ya no está en trial
      },

      include: { plan: true },
    });
  }

  /**
   * Verificar si una suscripción está activa
   */
  async isSubscriptionActive(businessId: string): Promise<boolean> {
    try {
      const subscription = await this.getCurrentSubscription(businessId);
      return (
        subscription.status === SubscriptionStatus.ACTIVE ||
        subscription.status === SubscriptionStatus.TRIAL
      );
    } catch {
      return false;
    }
  }

  /**
   * Obtener días restantes de trial
   */
  async getTrialDaysRemaining(businessId: string): Promise<number | null> {
    try {
      const subscription = await this.getCurrentSubscription(businessId);

      if (
        subscription.status !== SubscriptionStatus.TRIAL ||
        !subscription.trialEndsAt
      ) {
        return null;
      }

      const now = new Date();
      const trialEnd = new Date(subscription.trialEndsAt);
      const diffTime = trialEnd.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays > 0 ? diffDays : 0;
    } catch {
      return null;
    }
  }

  /**
   * Crear preferencia de pago para activar suscripción después del trial
   * Solo hay un plan disponible: Pro
   * @param businessId - ID del negocio
   * @returns Preferencia de pago de Mercado Pago
   */
  async createSubscriptionPaymentPreference(businessId: string) {
    const subscription = await this.getCurrentSubscription(businessId);

    // Obtener el plan Pro (único plan disponible)

    const plan = await this.prisma.subscriptionPlan.findFirst({
      where: { name: 'Pro' },
    });

    if (!plan) {
      throw new NotFoundException('Plan Pro no encontrado');
    }

    // Verificar que la suscripción esté en TRIAL o EXPIRED
    if (
      subscription.status !== SubscriptionStatus.TRIAL &&
      subscription.status !== SubscriptionStatus.EXPIRED
    ) {
      throw new BadRequestException(
        'Solo se puede pagar una suscripción en trial o expirada',
      );
    }

    // Obtener el negocio para usar su token de Mercado Pago
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Negocio no encontrado');
    }

    // Verificar que el negocio tenga Mercado Pago configurado
    if (!business.mercadopagoEnabled || !business.mercadopagoAccessToken) {
      throw new BadRequestException(
        'El negocio no tiene Mercado Pago configurado. Configúralo primero en la sección de pagos.',
      );
    }

    // URLs de redirección
    const adminUrl =
      this.configService.get<string>('ADMIN_URL') || 'http://localhost:3002';
    const apiUrl =
      this.configService.get<string>('API_URL') || 'http://localhost:3000';

    // Crear preferencia de pago
    const preference = await this.mercadoPagoService.createPreference({
      accessToken: business.mercadopagoAccessToken,
      items: [
        {
          title: `Suscripción ${plan.name} - Turns`,
          quantity: 1,
          unit_price: plan.price,
          currency_id: plan.currency || 'ARS',
        },
      ],
      back_urls: {
        success: `${adminUrl}/dashboard/suscripcion?payment=success`,
        failure: `${adminUrl}/dashboard/suscripcion?payment=failure`,
        pending: `${adminUrl}/dashboard/suscripcion?payment=pending`,
      },
      notification_url: `${apiUrl}/api/v1/webhooks/mercadopago`,
      external_reference: `subscription-${businessId}-pro`,
      statement_descriptor: 'TURNS-SUSC',
    });

    // Guardar referencia del pago pendiente
    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        planId: plan.id, // Actualizar al plan seleccionado
      },
    });

    return {
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
      planId: plan.id,
      planName: plan.name,
      price: plan.price,
      currency: plan.currency,
    };
  }

  /**
   * Activar suscripción después de pago exitoso (llamado desde webhook o manualmente)
   * Solo hay un plan disponible: Pro
   * @param businessId - ID del negocio
   * @param paymentId - ID del pago en Mercado Pago (opcional)
   * @returns Suscripción activada
   */
  async activateSubscriptionAfterPayment(
    businessId: string,
    paymentId?: string,
  ) {
    const subscription = await this.getCurrentSubscription(businessId);

    // Asegurar que la suscripción esté en el plan Pro

    const proPlan = await this.prisma.subscriptionPlan.findFirst({
      where: { name: 'Pro' },
    });

    if (!proPlan) {
      throw new NotFoundException('Plan Pro no encontrado');
    }

    // Actualizar al plan Pro si no lo está

    if (subscription.planId !== proPlan.id) {
      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          planId: proPlan.id,
        },
      });
    }

    // Calcular próximo período (1 mes desde ahora)
    const now = new Date();
    const nextPeriodEnd = new Date(now);
    nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + 1);

    return this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: now,
        currentPeriodEnd: nextPeriodEnd,
        trialEndsAt: null, // Ya no está en trial
        mercadopagoSubscriptionId: paymentId || null,
      },

      include: { plan: true },
    });
  }
}
