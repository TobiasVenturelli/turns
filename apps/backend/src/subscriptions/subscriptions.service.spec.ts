/**
 * @file subscriptions.service.spec.ts
 * @description Tests para el servicio de suscripciones
 * @author Turns Team
 * @created 2025-11-14
 */

import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let prismaService: PrismaService;

  const mockPlan = {
    id: 'plan-1',
    name: 'Pro',
    description: 'Plan profesional',
    price: 20000,
    currency: 'ARS',
    interval: 'month',
    features: {
      maxServices: -1,
      maxAppointmentsPerMonth: -1,
      analytics: true,
      customBranding: true,
      prioritySupport: true,
      multipleLocations: true,
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSubscription = {
    id: 'sub-1',
    businessId: 'business-1',
    planId: 'plan-1',
    plan: mockPlan,
    status: SubscriptionStatus.TRIAL,
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    cancelAtPeriodEnd: false,
    trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    mercadopagoSubscriptionId: null,
    mercadopagoPreapprovalId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBusiness = {
    id: 'business-1',
    name: 'Test Business',
    slug: 'test-business',
    userId: 'user-1',
    isActive: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        {
          provide: PrismaService,
          useValue: {
            subscriptionPlan: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
            subscription: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            business: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPlans', () => {
    it('debería retornar todos los planes activos ordenados por precio', async () => {
      const mockPlans = [
        { ...mockPlan, id: 'plan-1', name: 'Free', price: 0 },
        { ...mockPlan, id: 'plan-2', name: 'Basic', price: 15000 },
        { ...mockPlan, id: 'plan-3', name: 'Pro', price: 20000 },
      ];

      (prismaService.subscriptionPlan.findMany as jest.Mock).mockResolvedValue(
        mockPlans,
      );

      const result = await service.getPlans();

      expect(result).toEqual(mockPlans);
      expect(
        // eslint-disable-next-line @typescript-eslint/unbound-method
        prismaService.subscriptionPlan.findMany,
      ).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { price: 'asc' },
      });
    });
  });

  describe('getPlanById', () => {
    it('debería retornar un plan cuando existe', async () => {
      (
        prismaService.subscriptionPlan.findUnique as jest.Mock
      ).mockResolvedValue(mockPlan);

      const result = await service.getPlanById('plan-1');

      expect(result).toEqual(mockPlan);
      expect(
        // eslint-disable-next-line @typescript-eslint/unbound-method
        prismaService.subscriptionPlan.findUnique,
      ).toHaveBeenCalledWith({
        where: { id: 'plan-1' },
      });
    });

    it('debería lanzar NotFoundException cuando el plan no existe', async () => {
      (
        prismaService.subscriptionPlan.findUnique as jest.Mock
      ).mockResolvedValue(null);

      await expect(service.getPlanById('plan-invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getCurrentSubscription', () => {
    it('debería retornar la suscripción actual', async () => {
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(
        mockSubscription,
      );

      const result = await service.getCurrentSubscription('business-1');

      expect(result).toEqual(mockSubscription);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prismaService.subscription.findUnique).toHaveBeenCalledWith({
        where: { businessId: 'business-1' },
        include: { plan: true },
      });
    });

    it('debería lanzar NotFoundException cuando no hay suscripción', async () => {
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(
        service.getCurrentSubscription('business-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('debería actualizar el estado a EXPIRED si el trial expiró', async () => {
      const expiredSubscription = {
        ...mockSubscription,
        status: SubscriptionStatus.TRIAL,
        trialEndsAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Ayer
      };

      const updatedSubscription = {
        ...expiredSubscription,
        status: SubscriptionStatus.EXPIRED,
      };

      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(
        expiredSubscription,
      );
      (prismaService.subscription.update as jest.Mock).mockResolvedValue(
        updatedSubscription,
      );

      const result = await service.getCurrentSubscription('business-1');

      expect(result.status).toBe(SubscriptionStatus.EXPIRED);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prismaService.subscription.update).toHaveBeenCalledWith({
        where: { id: expiredSubscription.id },
        data: { status: SubscriptionStatus.EXPIRED },
        include: { plan: true },
      });
    });
  });

  describe('createSubscription', () => {
    it('debería crear una nueva suscripción con trial de 7 días', async () => {
      (prismaService.business.findUnique as jest.Mock).mockResolvedValue(
        mockBusiness,
      );
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(
        null,
      );
      (
        prismaService.subscriptionPlan.findUnique as jest.Mock
      ).mockResolvedValue(mockPlan);
      (prismaService.subscription.create as jest.Mock).mockResolvedValue(
        mockSubscription,
      );

      const result = await service.createSubscription('business-1', {
        planId: 'plan-1',
      });

      expect(result).toEqual(mockSubscription);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prismaService.subscription.create).toHaveBeenCalled();
      const createCall = (prismaService.subscription.create as jest.Mock).mock
        .calls[0] as [{ data: unknown }];
      const createData = createCall[0]?.data as {
        status: SubscriptionStatus;
        businessId: string;
        planId: string;
      };
      expect(createData.status).toBe(SubscriptionStatus.TRIAL);
      expect(createData.businessId).toBe('business-1');
      expect(createData.planId).toBe('plan-1');
    });

    it('debería lanzar NotFoundException cuando el negocio no existe', async () => {
      (prismaService.business.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.createSubscription('business-invalid', { planId: 'plan-1' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar ConflictException cuando ya existe una suscripción', async () => {
      (prismaService.business.findUnique as jest.Mock).mockResolvedValue(
        mockBusiness,
      );
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(
        mockSubscription,
      );

      await expect(
        service.createSubscription('business-1', { planId: 'plan-1' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('changePlan', () => {
    it('debería cambiar el plan exitosamente', async () => {
      const activeSubscription = {
        ...mockSubscription,
        status: SubscriptionStatus.ACTIVE,
      };
      const newPlan = {
        ...mockPlan,
        id: 'plan-2',
        name: 'Basic',
        price: 15000,
      };

      (prismaService.subscription.findUnique as jest.Mock)
        .mockResolvedValueOnce(activeSubscription)
        .mockResolvedValueOnce(activeSubscription);
      (
        prismaService.subscriptionPlan.findUnique as jest.Mock
      ).mockResolvedValue(newPlan);
      (prismaService.subscription.update as jest.Mock).mockResolvedValue({
        ...activeSubscription,
        planId: 'plan-2',
        plan: newPlan,
      });

      const result = await service.changePlan('business-1', 'plan-2');

      expect(result.planId).toBe('plan-2');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prismaService.subscription.update).toHaveBeenCalled();
    });

    it('debería lanzar BadRequestException si está en trial', async () => {
      const newPlan = { ...mockPlan, id: 'plan-2' };

      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(
        mockSubscription,
      );
      (
        prismaService.subscriptionPlan.findUnique as jest.Mock
      ).mockResolvedValue(newPlan);

      await expect(service.changePlan('business-1', 'plan-2')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debería lanzar BadRequestException si está expirado', async () => {
      const expiredSubscription = {
        ...mockSubscription,
        status: SubscriptionStatus.EXPIRED,
      };
      const newPlan = { ...mockPlan, id: 'plan-2' };

      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(
        expiredSubscription,
      );
      (
        prismaService.subscriptionPlan.findUnique as jest.Mock
      ).mockResolvedValue(newPlan);

      await expect(service.changePlan('business-1', 'plan-2')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('cancelSubscription', () => {
    it('debería cancelar la suscripción exitosamente', async () => {
      const activeSubscription = {
        ...mockSubscription,
        status: SubscriptionStatus.ACTIVE,
      };

      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(
        activeSubscription,
      );
      (prismaService.subscription.update as jest.Mock).mockResolvedValue({
        ...activeSubscription,
        status: SubscriptionStatus.CANCELLED,
        cancelAtPeriodEnd: true,
      });

      const result = await service.cancelSubscription('business-1');

      expect(result.status).toBe(SubscriptionStatus.CANCELLED);
      expect(result.cancelAtPeriodEnd).toBe(true);
    });

    it('debería lanzar BadRequestException si ya está expirada', async () => {
      const expiredSubscription = {
        ...mockSubscription,
        status: SubscriptionStatus.EXPIRED,
      };

      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(
        expiredSubscription,
      );

      await expect(service.cancelSubscription('business-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('reactivateSubscription', () => {
    it('debería reactivar una suscripción cancelada', async () => {
      const cancelledSubscription = {
        ...mockSubscription,
        status: SubscriptionStatus.CANCELLED,
        cancelAtPeriodEnd: true,
      };

      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(
        cancelledSubscription,
      );
      (prismaService.subscription.update as jest.Mock).mockResolvedValue({
        ...cancelledSubscription,
        status: SubscriptionStatus.ACTIVE,
        cancelAtPeriodEnd: false,
      });

      const result = await service.reactivateSubscription('business-1');

      expect(result.status).toBe(SubscriptionStatus.ACTIVE);
      expect(result.cancelAtPeriodEnd).toBe(false);
    });

    it('debería lanzar BadRequestException si no está cancelada', async () => {
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(
        mockSubscription,
      );

      await expect(
        service.reactivateSubscription('business-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('isSubscriptionActive', () => {
    it('debería retornar true si la suscripción está activa', async () => {
      const activeSubscription = {
        ...mockSubscription,
        status: SubscriptionStatus.ACTIVE,
      };

      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(
        activeSubscription,
      );

      const result = await service.isSubscriptionActive('business-1');

      expect(result).toBe(true);
    });

    it('debería retornar true si está en trial', async () => {
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(
        mockSubscription,
      );

      const result = await service.isSubscriptionActive('business-1');

      expect(result).toBe(true);
    });

    it('debería retornar false si está expirada', async () => {
      const expiredSubscription = {
        ...mockSubscription,
        status: SubscriptionStatus.EXPIRED,
      };

      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(
        expiredSubscription,
      );

      const result = await service.isSubscriptionActive('business-1');

      expect(result).toBe(false);
    });

    it('debería retornar false si no existe suscripción', async () => {
      (prismaService.subscription.findUnique as jest.Mock).mockRejectedValue(
        new NotFoundException(),
      );

      const result = await service.isSubscriptionActive('business-1');

      expect(result).toBe(false);
    });
  });

  describe('getTrialDaysRemaining', () => {
    it('debería retornar los días restantes de trial', async () => {
      const trialEndsAt = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // 5 días
      const trialSubscription = {
        ...mockSubscription,
        status: SubscriptionStatus.TRIAL,
        trialEndsAt,
      };

      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(
        trialSubscription,
      );

      const result = await service.getTrialDaysRemaining('business-1');

      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThanOrEqual(5);
    });

    it('debería retornar null si no está en trial', async () => {
      const activeSubscription = {
        ...mockSubscription,
        status: SubscriptionStatus.ACTIVE,
        trialEndsAt: null,
      };

      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(
        activeSubscription,
      );

      const result = await service.getTrialDaysRemaining('business-1');

      expect(result).toBeNull();
    });

    it('debería retornar null si no existe suscripción', async () => {
      (prismaService.subscription.findUnique as jest.Mock).mockRejectedValue(
        new NotFoundException(),
      );

      const result = await service.getTrialDaysRemaining('business-1');

      expect(result).toBeNull();
    });
  });
});
