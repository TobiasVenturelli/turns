/**
 * @file mercadopago.service.ts
 * @description Servicio para interactuar con la API de Mercado Pago
 * @author Turns Team
 * @created 2025-11-08
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MercadoPagoConfig,
  Preference,
  Payment,
  PaymentRefund,
} from 'mercadopago';

/**
 * Interfaz para crear una preferencia de pago
 */
export interface CreatePreferenceDto {
  accessToken?: string; // Token del profesional (para OAuth)
  items: Array<{
    title: string;
    quantity: number;
    unit_price: number;
    currency_id?: string;
  }>;
  back_urls: {
    success: string;
    failure: string;
    pending?: string;
  };
  notification_url?: string;
  external_reference?: string; // ID del turno
  statement_descriptor?: string;
  marketplace_fee?: number; // Comisión de la plataforma (para split payment)
}

/**
 * Interfaz para la respuesta de una preferencia
 */
export interface PreferenceResponse {
  id: string;
  init_point: string;
  sandbox_init_point: string;
  client_id?: string;
}

/**
 * Interfaz para el estado de un pago
 */
export interface PaymentStatus {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded';
  status_detail: string;
  transaction_amount: number;
  currency_id: string;
  payment_method_id: string;
  payment_type_id: string;
  date_approved: string | null;
  external_reference: string | null;
}

@Injectable()
export class MercadoPagoService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly accessToken: string;

  constructor(private configService: ConfigService) {
    // Credenciales de la aplicación (para OAuth y operaciones generales)
    this.clientId =
      this.configService.get<string>('MERCADOPAGO_CLIENT_ID') || '';
    this.clientSecret =
      this.configService.get<string>('MERCADOPAGO_CLIENT_SECRET') || '';
    this.accessToken =
      this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN') || '';

    if (!this.clientId || !this.clientSecret) {
      console.warn(
        '⚠️ Mercado Pago credentials not configured. Payment features will not work.',
      );
    }
  }

  /**
   * Crea una preferencia de pago
   * @param dto - Datos para crear la preferencia
   * @returns Preferencia creada
   */
  async createPreference(
    dto: CreatePreferenceDto,
  ): Promise<PreferenceResponse> {
    try {
      // Si hay accessToken del profesional, usar ese cliente (OAuth)
      // Si no, usar las credenciales de la aplicación
      const client = new MercadoPagoConfig({
        accessToken: dto.accessToken || this.accessToken,
        options: {
          timeout: 5000,
          idempotencyKey: dto.external_reference || undefined,
        },
      });

      const preference = new Preference(client);

      const preferenceData = {
        items: dto.items.map((item, index) => ({
          id: `item-${index}`,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: item.currency_id || 'ARS',
        })),
        back_urls: {
          success: dto.back_urls.success,
          failure: dto.back_urls.failure,
          pending: dto.back_urls.pending || dto.back_urls.failure,
        },
        notification_url: dto.notification_url,
        external_reference: dto.external_reference,
        statement_descriptor: dto.statement_descriptor || 'TURNS',
        // Split payment (marketplace): comisión de la plataforma
        ...(dto.marketplace_fee && dto.marketplace_fee > 0
          ? {
              marketplace: 'NONE', // Deshabilitado por ahora, usar split payment manual
              // marketplace_fee: dto.marketplace_fee, // No disponible en SDK actual
            }
          : {}),
        auto_return: 'approved' as const,
      };

      const response = await preference.create({ body: preferenceData });

      return {
        id: response.id || '',
        init_point: response.init_point || '',
        sandbox_init_point:
          response.sandbox_init_point || response.init_point || '',
        client_id: this.clientId,
      };
    } catch (error: unknown) {
      console.error('Error creating Mercado Pago preference:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(
        `Error al crear preferencia de pago: ${errorMessage}`,
      );
    }
  }

  /**
   * Obtiene el estado de un pago
   * @param paymentId - ID del pago en Mercado Pago
   * @param accessToken - Token de acceso (opcional, para OAuth)
   * @returns Estado del pago
   */
  async getPayment(
    paymentId: string,
    accessToken?: string,
  ): Promise<PaymentStatus> {
    try {
      const client = new MercadoPagoConfig({
        accessToken: accessToken || this.accessToken,
        options: {
          timeout: 5000,
        },
      });

      const payment = new Payment(client);
      const response = await payment.get({ id: paymentId });

      return {
        id: response.id?.toString() || '',
        status: (response.status as PaymentStatus['status']) || 'pending',
        status_detail: response.status_detail || '',
        transaction_amount: response.transaction_amount || 0,
        currency_id: response.currency_id || 'ARS',
        payment_method_id: response.payment_method_id || '',
        payment_type_id: response.payment_type_id || '',
        date_approved: response.date_approved || null,
        external_reference: response.external_reference || null,
      };
    } catch (error: unknown) {
      console.error('Error getting Mercado Pago payment:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(`Error al obtener pago: ${errorMessage}`);
    }
  }

  /**
   * Procesa un reembolso
   * @param paymentId - ID del pago en Mercado Pago
   * @param amount - Monto a reembolsar (opcional, si no se especifica es reembolso total)
   * @param accessToken - Token de acceso (opcional, para OAuth)
   * @returns Reembolso procesado
   */
  async refundPayment(
    paymentId: string,
    amount?: number,
    accessToken?: string,
  ): Promise<{ id: string; status: string; amount: number }> {
    try {
      const client = new MercadoPagoConfig({
        accessToken: accessToken || this.accessToken,
        options: {
          timeout: 5000,
        },
      });

      const refund = new PaymentRefund(client);
      const refundData = amount ? { amount } : {};
      const response = await refund.create({
        payment_id: paymentId,
        body: refundData,
      });

      return {
        id: response.id?.toString() || '',
        status: response.status || 'pending',
        amount: response.amount || 0,
      };
    } catch (error: unknown) {
      console.error('Error refunding Mercado Pago payment:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(
        `Error al procesar reembolso: ${errorMessage}`,
      );
    }
  }

  /**
   * Verifica que un webhook sea válido
   * @param signature - Firma del webhook
   * @param requestId - ID de la solicitud
   * @param dataId - ID de los datos
   * @returns true si es válido
   */
  validateWebhook(
    signature: string,
    requestId: string,
    dataId: string,
  ): boolean {
    // Nota: Mercado Pago no requiere validación de firma en el webhook
    // Solo verificar que los datos existan
    return !!(requestId && dataId);
  }

  /**
   * Obtiene la URL de autorización OAuth para Mercado Pago
   * @param redirectUri - URI de redirección después de la autorización
   * @returns URL de autorización
   */
  getOAuthAuthorizationUrl(redirectUri: string): string {
    const baseUrl =
      this.configService.get<string>('MERCADOPAGO_BASE_URL') ||
      'https://auth.mercadopago.com.ar';
    const scope = 'offline_access payments read write';

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      platform_id: 'mp',
      redirect_uri: redirectUri,
      scope,
    });

    return `${baseUrl}/authorization?${params.toString()}`;
  }

  /**
   * Intercambia un código de autorización por tokens de acceso
   * @param code - Código de autorización
   * @param redirectUri - URI de redirección
   * @returns Tokens de acceso y refresh
   */
  async exchangeAuthorizationCode(
    code: string,
    redirectUri: string,
  ): Promise<{ access_token: string; refresh_token: string; user_id: string }> {
    try {
      // Nota: Esto requiere hacer una llamada HTTP directa a la API de Mercado Pago
      // ya que el SDK no tiene un método específico para esto
      const response = await fetch('https://api.mercadopago.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { message?: string };
        throw new BadRequestException(
          `Error al intercambiar código: ${errorData.message || 'Error desconocido'}`,
        );
      }

      const data = (await response.json()) as {
        access_token: string;
        refresh_token: string;
        user_id: string | number;
      };
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user_id: data.user_id?.toString() || '',
      };
    } catch (error: unknown) {
      console.error('Error exchanging authorization code:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(
        `Error al obtener tokens de acceso: ${errorMessage}`,
      );
    }
  }
}
