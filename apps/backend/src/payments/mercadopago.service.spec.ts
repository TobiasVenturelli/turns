/**
 * @file mercadopago.service.spec.ts
 * @description Tests para el servicio de Mercado Pago
 * @author Turns Team
 * @created 2025-11-13
 */

import { Test, TestingModule } from '@nestjs/testing';
import { MercadoPagoService } from './mercadopago.service';
import { ConfigService } from '@nestjs/config';

describe('MercadoPagoService', () => {
  let service: MercadoPagoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MercadoPagoService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, string> = {
                MERCADOPAGO_CLIENT_ID: 'test-client-id',
                MERCADOPAGO_CLIENT_SECRET: 'test-client-secret',
                MERCADOPAGO_ACCESS_TOKEN: 'test-access-token',
                MERCADOPAGO_BASE_URL: 'https://auth.mercadopago.com.ar',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<MercadoPagoService>(MercadoPagoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOAuthAuthorizationUrl', () => {
    it('debe generar la URL de autorización correctamente', () => {
      const redirectUri = 'http://localhost:3002/callback';
      const url = service.getOAuthAuthorizationUrl(redirectUri);

      expect(url).toContain('https://auth.mercadopago.com.ar/authorization');
      expect(url).toContain('client_id=test-client-id');
      expect(url).toContain('redirect_uri=');
      expect(url).toContain('response_type=code');
    });
  });

  describe('validateWebhook', () => {
    it('debe validar un webhook correctamente', () => {
      const result = service.validateWebhook(
        'signature',
        'request-123',
        'data-123',
      );
      expect(result).toBe(true);
    });

    it('debe retornar false si faltan datos', () => {
      const result = service.validateWebhook('signature', '', 'data-123');
      expect(result).toBe(false);
    });
  });
});
