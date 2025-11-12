/**
 * @file payments.controller.ts
 * @description Controlador para gestión de pagos
 * @author Turns Team
 * @created 2025-11-08
 */

import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentPreferenceDto, RefundPaymentDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Crea una preferencia de pago para un turno
   * POST /api/v1/payments/appointments/:appointmentId/create-preference
   */
  @Post('appointments/:appointmentId/create-preference')
  @HttpCode(HttpStatus.OK)
  async createPaymentPreference(
    @Param('appointmentId') appointmentId: string,
    @Body() dto: CreatePaymentPreferenceDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.paymentsService.createPaymentPreference(
      appointmentId,
      dto,
      user.id,
    );
  }

  /**
   * Obtiene el estado de un pago
   * GET /api/v1/payments/:paymentId/status
   */
  @Get(':paymentId/status')
  async getPaymentStatus(@Param('paymentId') paymentId: string) {
    return this.paymentsService.getPaymentStatus(paymentId);
  }

  /**
   * Procesa un reembolso
   * POST /api/v1/payments/:paymentId/refund
   */
  @Post(':paymentId/refund')
  @HttpCode(HttpStatus.OK)
  async refundPayment(
    @Param('paymentId') paymentId: string,
    @Body() dto: RefundPaymentDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.paymentsService.refundPayment(paymentId, dto, user.id);
  }
}

/**
 * Controlador para webhooks de Mercado Pago
 */
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Webhook de Mercado Pago
   * POST /api/v1/webhooks/mercadopago
   */
  @Post('mercadopago')
  @Public() // Los webhooks no requieren autenticación
  @HttpCode(HttpStatus.OK)
  async handleMercadoPagoWebhook(
    @Body() body: { type: string; data: { id: string } },
  ) {
    try {
      const { type, data } = body;

      if (type === 'payment') {
        const paymentId = data.id;
        return await this.paymentsService.handleWebhookNotification(paymentId);
      }

      return { success: true, message: 'Webhook recibido pero no procesado' };
    } catch (error: unknown) {
      console.error('Error processing webhook:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      // Retornar 200 para que Mercado Pago no reintente
      return { success: false, error: errorMessage };
    }
  }
}
