/**
 * @file payments.service.spec.ts
 * @description Tests para el servicio de pagos
 * @author Turns Team
 * @created 2025-11-13
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { MercadoPagoService } from './mercadopago.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ConfigService } from '@nestjs/config';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prismaService: PrismaService;
  let mercadoPagoService: MercadoPagoService;
  let notificationsService: NotificationsService;

  const mockAppointment = {
    id: 'appointment-1',
    customerId: 'customer-1',
    professionalId: 'professional-1',
    businessId: 'business-1',
    serviceId: 'service-1',
    startTime: new Date('2025-11-15T10:00:00Z'),
    endTime: new Date('2025-11-15T10:30:00Z'),
    status: 'confirmed',
    isPaid: false,
    paymentMethod: null,
    mercadopagoPaymentId: null,
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    customer: {
      id: 'customer-1',
      email: 'customer@test.com',
      firstName: 'John',
      lastName: 'Doe',
    },
    business: {
      id: 'business-1',
      name: 'Test Business',
      mercadopagoEnabled: true,
      mercadopagoAccessToken: 'test-token',
      email: 'business@test.com',
      phone: '123456789',
      address: 'Test Address',
    },
    service: {
      id: 'service-1',
      name: 'Test Service',
      price: 1000,
      duration: 30,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: {
            appointment: {
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: MercadoPagoService,
          useValue: {
            createPreference: jest.fn(),
            getPayment: jest.fn(),
            refundPayment: jest.fn(),
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            sendEmail: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, string> = {
                NEXT_PUBLIC_WEB_URL: 'http://localhost:3001',
                API_URL: 'http://localhost:3000',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prismaService = module.get<PrismaService>(PrismaService);
    mercadoPagoService = module.get<MercadoPagoService>(MercadoPagoService);
    notificationsService =
      module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPaymentPreference', () => {
    it('debe crear una preferencia de pago exitosamente', async () => {
      const dto = {
        appointmentId: 'appointment-1',
        amount: 1000,
        currency: 'ARS',
        description: 'Test Service',
      };

      jest
        .spyOn(prismaService.appointment, 'findUnique')
        .mockResolvedValue(mockAppointment as never);
      jest.spyOn(mercadoPagoService, 'createPreference').mockResolvedValue({
        id: 'pref-123',
        init_point: 'https://mp.com/init',
        sandbox_init_point: 'https://mp.com/sandbox',
        client_id: 'client-123',
      });

      const result = await service.createPaymentPreference(
        'appointment-1',
        dto,
        'customer-1',
      );

      expect(result).toHaveProperty('preferenceId');
      expect(result).toHaveProperty('initPoint');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mercadoPagoService.createPreference).toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si el turno no existe', async () => {
      jest
        .spyOn(prismaService.appointment, 'findUnique')
        .mockResolvedValue(null);

      const dto = {
        appointmentId: 'appointment-1',
        amount: 1000,
      };
      await expect(
        service.createPaymentPreference('appointment-1', dto, 'customer-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar BadRequestException si el turno ya está pagado', async () => {
      const paidAppointment = { ...mockAppointment, isPaid: true };
      jest
        .spyOn(prismaService.appointment, 'findUnique')
        .mockResolvedValue(paidAppointment as never);

      const dto = {
        appointmentId: 'appointment-1',
        amount: 1000,
      };
      await expect(
        service.createPaymentPreference('appointment-1', dto, 'customer-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('debe lanzar BadRequestException si el negocio no tiene Mercado Pago configurado', async () => {
      const appointmentWithoutMP = {
        ...mockAppointment,
        business: { ...mockAppointment.business, mercadopagoEnabled: false },
      };
      jest
        .spyOn(prismaService.appointment, 'findUnique')
        .mockResolvedValue(appointmentWithoutMP as never);

      const dto = {
        appointmentId: 'appointment-1',
        amount: 1000,
      };
      await expect(
        service.createPaymentPreference('appointment-1', dto, 'customer-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('handleWebhookNotification', () => {
    it('debe procesar un pago aprobado correctamente', async () => {
      const mockPayment = {
        id: 'payment-123',
        status: 'approved',
        external_reference: 'appointment-1',
        transaction_amount: 1000,
        payment_method_id: 'credit_card',
        status_detail: 'accredited',
        currency_id: 'ARS',
        payment_type_id: 'credit_card',
        date_approved: '2025-11-13',
      };

      jest
        .spyOn(mercadoPagoService, 'getPayment')
        .mockResolvedValue(mockPayment as never);
      jest
        .spyOn(prismaService.appointment, 'findUnique')
        .mockResolvedValue(mockAppointment as never);
      jest
        .spyOn(prismaService.appointment, 'update')
        .mockResolvedValue({ ...mockAppointment, isPaid: true } as never);
      jest
        .spyOn(notificationsService, 'sendEmail')
        .mockResolvedValue({ success: true, message: 'Email sent' });

      const result = await service.handleWebhookNotification('payment-123');

      expect(result.success).toBe(true);
      expect(result.paymentStatus).toBe('approved');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prismaService.appointment.update).toHaveBeenCalledWith({
        where: { id: 'appointment-1' },
        data: {
          isPaid: true,
          paymentMethod: 'credit_card',
          mercadopagoPaymentId: 'payment-123',
        },
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(notificationsService.sendEmail).toHaveBeenCalled();
    });

    it('debe lanzar BadRequestException si no hay referencia externa', async () => {
      const mockPayment = {
        id: 'payment-123',
        status: 'approved',
        external_reference: null,
      };

      jest
        .spyOn(mercadoPagoService, 'getPayment')
        .mockResolvedValue(mockPayment as never);

      await expect(
        service.handleWebhookNotification('payment-123'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('refundPayment', () => {
    it('debe lanzar NotFoundException si el pago no existe', async () => {
      jest
        .spyOn(prismaService.appointment, 'findFirst')
        .mockResolvedValue(null);

      await expect(
        service.refundPayment('payment-123', {}, 'professional-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
