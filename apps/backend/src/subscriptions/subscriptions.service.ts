import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtener todos los planes de suscripción disponibles
   */
  async getPlans() {
    return this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
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
   * Se crea automáticamente con trial de 7 días
   */
  async createSubscription(
    businessId: string,
    createSubscriptionDto: CreateSubscriptionDto,
  ) {
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

    // Verificar que el plan existe
    const plan = await this.getPlanById(createSubscriptionDto.planId);

    // Crear suscripción con trial de 7 días
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);

    return this.prisma.subscription.create({
      data: {
        businessId,
        planId: plan.id,
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
}
