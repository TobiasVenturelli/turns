/**
 * @file payments.service.ts
 * @description Servicio para gestionar pagos de turnos
 * @author Turns Team
 * @created 2025-11-08
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MercadoPagoService } from './mercadopago.service';
import { CreatePaymentPreferenceDto, RefundPaymentDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from '../notifications/notifications.service';
import { WebSocketsService } from '../websockets/websockets.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private mercadoPagoService: MercadoPagoService,
    private configService: ConfigService,
    private notificationsService: NotificationsService,
    private websocketsService: WebSocketsService,
  ) {}

  /**
   * Crea una preferencia de pago para un turno
   * @param appointmentId - ID del turno
   * @param dto - Datos de la preferencia
   * @param userId - ID del usuario (cliente)
   * @returns Preferencia creada
   */
  async createPaymentPreference(
    appointmentId: string,
    dto: CreatePaymentPreferenceDto,
    userId: string,
  ) {
    // Verificar que el turno existe y pertenece al cliente
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        customer: true,
        business: true,
        service: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Turno no encontrado');
    }

    if (appointment.customerId !== userId) {
      throw new ForbiddenException('No tienes permisos para pagar este turno');
    }

    if (appointment.isPaid) {
      throw new BadRequestException('Este turno ya está pagado');
    }

    // Verificar que el negocio tenga Mercado Pago configurado
    if (
      !appointment.business.mercadopagoEnabled ||
      !appointment.business.mercadopagoAccessToken
    ) {
      throw new BadRequestException(
        'El negocio no tiene Mercado Pago configurado. Contacta al profesional.',
      );
    }

    // Calcular monto (seña o total)
    const amount = dto.amount || appointment.service.price || 0;
    const currency = dto.currency || appointment.business.currency || 'ARS';

    // URLs de redirección
    const webUrl =
      this.configService.get<string>('WEB_URL') || 'http://localhost:3001';
    const apiUrl =
      this.configService.get<string>('API_URL') || 'http://localhost:3000';
    const businessSlug = appointment.business.slug;

    // Crear preferencia de pago
    const preference = await this.mercadoPagoService.createPreference({
      accessToken: appointment.business.mercadopagoAccessToken || undefined,
      items: [
        {
          title: dto.description || `Seña - ${appointment.service.name}`,
          quantity: 1,
          unit_price: amount,
          currency_id: currency,
        },
      ],
      back_urls: {
        success: `${webUrl}/${businessSlug}/pago/exito?payment_id={PAYMENT_ID}`,
        failure: `${webUrl}/${businessSlug}/pago/error?payment_id={PAYMENT_ID}`,
        pending: `${webUrl}/${businessSlug}/pago/pendiente?payment_id={PAYMENT_ID}`,
      },
      notification_url: `${apiUrl}/api/v1/webhooks/mercadopago`,
      external_reference: appointmentId,
      statement_descriptor: 'TURNS',
      // marketplace_fee: amount * 0.05, // 5% de comisión (si se implementa split payment)
    });

    // Guardar referencia de la preferencia en el turno
    await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        price: amount,
        currency: currency,
      },
    });

    return {
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
      appointmentId,
      amount,
      currency,
    };
  }

  /**
   * Procesa una notificación de webhook de Mercado Pago
   * @param paymentId - ID del pago en Mercado Pago
   * @returns Resultado del procesamiento
   */
  async handleWebhookNotification(paymentId: string) {
    try {
      // Obtener el pago de Mercado Pago
      // Nota: Necesitamos el accessToken del negocio, pero no lo tenemos aquí
      // Por ahora, buscamos el turno por external_reference después de obtener el pago
      const payment = await this.mercadoPagoService.getPayment(paymentId);

      if (!payment.external_reference) {
        throw new BadRequestException(
          'No se encontró referencia externa en el pago',
        );
      }

      const appointmentId = payment.external_reference;

      // Buscar el turno
      const appointment = await this.prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          customer: true,
          business: true,
          service: true,
        },
      });

      if (!appointment) {
        throw new NotFoundException('Turno no encontrado');
      }

      // Obtener el pago completo con el accessToken del negocio
      const paymentDetails = await this.mercadoPagoService.getPayment(
        paymentId,
        appointment.business.mercadopagoAccessToken || undefined,
      );

      // Actualizar el turno según el estado del pago
      if (paymentDetails.status === 'approved') {
        const updatedAppointment = await this.prisma.appointment.update({
          where: { id: appointmentId },
          data: {
            isPaid: true,
            paymentMethod: paymentDetails.payment_method_id,
            mercadopagoPaymentId: paymentId,
          },
          include: {
            service: true,
            business: true,
            customer: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
              },
            },
          },
        });

        // Notificar vía WebSocket
        this.websocketsService.notifyPaymentConfirmed(appointment.businessId, {
          paymentId,
          appointmentId,
          amount: paymentDetails.transaction_amount,
          status: paymentDetails.status,
          appointment: updatedAppointment,
        });

        // Enviar notificación de confirmación de pago
        await this.notificationsService.sendEmail({
          to: appointment.customer.email,
          subject: 'Pago confirmado - Turno reservado',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
                  .content { padding: 20px; background-color: #f9f9f9; }
                  .details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #4CAF50; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Pago Confirmado</h1>
                  </div>
                  <div class="content">
                    <p>Tu pago de $${paymentDetails.transaction_amount} ARS ha sido confirmado.</p>
                    <div class="details">
                      <p><strong>Turno:</strong> ${appointment.service.name}</p>
                      <p><strong>Fecha:</strong> ${new Date(appointment.startTime).toLocaleString('es-AR')}</p>
                      <p><strong>Método de pago:</strong> ${paymentDetails.payment_method_id}</p>
                    </div>
                    <p>¡Gracias por tu reserva!</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        });
      } else if (paymentDetails.status === 'rejected') {
        // El pago fue rechazado, no actualizamos el turno
        console.log(
          `Pago rechazado para turno ${appointmentId}: ${paymentDetails.status_detail}`,
        );
      }

      return {
        success: true,
        appointmentId,
        paymentStatus: paymentDetails.status,
      };
    } catch (error: unknown) {
      console.error('Error processing webhook notification:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(
        `Error al procesar notificación: ${errorMessage}`,
      );
    }
  }

  /**
   * Obtiene el estado de un pago
   * @param paymentId - ID del pago en Mercado Pago
   * @returns Estado del pago
   */
  async getPaymentStatus(paymentId: string) {
    try {
      // Buscar el turno asociado al pago
      const appointment = await this.prisma.appointment.findFirst({
        where: { mercadopagoPaymentId: paymentId },
        include: {
          business: true,
        },
      });

      if (!appointment) {
        throw new NotFoundException('Pago no encontrado');
      }

      // Obtener el estado del pago de Mercado Pago
      const payment = await this.mercadoPagoService.getPayment(
        paymentId,
        appointment.business.mercadopagoAccessToken || undefined,
      );

      return {
        id: payment.id,
        status: payment.status,
        statusDetail: payment.status_detail,
        amount: payment.transaction_amount,
        currency: payment.currency_id,
        paymentMethod: payment.payment_method_id,
        dateApproved: payment.date_approved,
        appointmentId: appointment.id,
      };
    } catch (error: unknown) {
      console.error('Error getting payment status:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(
        `Error al obtener estado del pago: ${errorMessage}`,
      );
    }
  }

  /**
   * Procesa un reembolso
   * @param paymentId - ID del pago en Mercado Pago
   * @param dto - Datos del reembolso
   * @param userId - ID del usuario (profesional o cliente)
   * @returns Reembolso procesado
   */
  async refundPayment(
    paymentId: string,
    dto: RefundPaymentDto,
    userId: string,
  ) {
    try {
      // Buscar el turno asociado al pago
      const appointment = await this.prisma.appointment.findFirst({
        where: { mercadopagoPaymentId: paymentId },
        include: {
          service: true,
          business: true,
          customer: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
        },
      });

      if (!appointment) {
        throw new NotFoundException('Pago no encontrado');
      }

      // Verificar permisos: solo el profesional o el cliente pueden solicitar reembolso
      if (
        appointment.customerId !== userId &&
        appointment.professionalId !== userId
      ) {
        throw new ForbiddenException(
          'No tienes permisos para procesar este reembolso',
        );
      }

      if (!appointment.isPaid) {
        throw new BadRequestException('Este turno no está pagado');
      }

      // Procesar reembolso en Mercado Pago
      const refund = await this.mercadoPagoService.refundPayment(
        paymentId,
        dto.amount,
        appointment.business.mercadopagoAccessToken || undefined,
      );

      // Si es reembolso total, marcar el turno como no pagado
      let updatedAppointment = appointment;
      if (!dto.amount) {
        updatedAppointment = await this.prisma.appointment.update({
          where: { id: appointment.id },
          data: {
            isPaid: false,
            mercadopagoPaymentId: null,
          },
          include: {
            service: true,
            business: true,
            customer: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
              },
            },
          },
        });
      }

      // Notificar vía WebSocket
      this.websocketsService.notifyPaymentRefunded(appointment.businessId, {
        paymentId,
        appointmentId: appointment.id,
        refundAmount: dto.amount || refund.amount,
        appointment: updatedAppointment,
      });

      // Enviar notificación de reembolso
      await this.notificationsService.sendEmail({
        to: appointment.customer.email,
        subject: 'Reembolso procesado',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #FF9800; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Reembolso Procesado</h1>
                </div>
                <div class="content">
                  <p>Se ha procesado un reembolso de $${refund.amount} ARS.</p>
                  <div class="details">
                    <p><strong>Turno:</strong> ${appointment.id}</p>
                  </div>
                  <p>El dinero será acreditado en tu cuenta en los próximos días hábiles.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      return {
        id: refund.id,
        status: refund.status,
        amount: refund.amount,
        appointmentId: appointment.id,
      };
    } catch (error: unknown) {
      console.error('Error refunding payment:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(
        `Error al procesar reembolso: ${errorMessage}`,
      );
    }
  }
}
