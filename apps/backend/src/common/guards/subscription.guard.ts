/**
 * @file subscription.guard.ts
 * @description Guard para verificar que el usuario tenga una suscripción activa
 * @author Turns Team
 * @created 2025-11-13
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface RequestUser {
  id: string;
  email: string;
  role: 'CUSTOMER' | 'PROFESSIONAL' | 'ADMIN';
}

interface RequestWithUser {
  user: RequestUser;
}

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    // Si no es profesional, no necesita suscripción
    if (user.role !== 'PROFESSIONAL') {
      return true;
    }

    // Buscar el negocio del profesional
    const business = await this.prisma.business.findUnique({
      where: { userId: user.id },
    });

    if (!business) {
      throw new ForbiddenException(
        'No business found. Please complete your profile.',
      );
    }

    // Buscar la suscripción del negocio
    const subscription = await this.prisma.subscription.findUnique({
      where: { businessId: business.id },
    });

    if (!subscription) {
      throw new ForbiddenException('No subscription found.');
    }
    const now = new Date();

    // Verificar estado de la suscripción
    switch (subscription.status) {
      case 'TRIAL':
        // Verificar si el trial ha expirado
        if (subscription.trialEndsAt && now > subscription.trialEndsAt) {
          // Actualizar estado a EXPIRED
          await this.prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: 'EXPIRED' },
          });
          throw new ForbiddenException(
            'Your trial period has expired. Please subscribe to continue.',
          );
        }
        return true;

      case 'ACTIVE':
        // Verificar si el período actual ha expirado
        if (now > subscription.currentPeriodEnd) {
          // Actualizar estado a EXPIRED
          await this.prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: 'EXPIRED' },
          });
          throw new ForbiddenException(
            'Your subscription has expired. Please renew to continue.',
          );
        }
        return true;

      case 'EXPIRED':
        throw new ForbiddenException(
          'Your subscription has expired. Please subscribe to continue.',
        );

      default:
        throw new ForbiddenException('Invalid subscription status.');
    }
  }
}
