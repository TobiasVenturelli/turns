/**
 * @file notifications.service.ts
 * @description Servicio para gestión de notificaciones (email)
 * @author Turns Team
 * @created 2025-11-08
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendEmailDto } from './dto/send-email.dto';

interface AppointmentEmailData {
  customerName: string;
  businessName: string;
  serviceName: string;
  date: string;
  time: string;
  address?: string;
  phone?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly emailEnabled: boolean;

  constructor(private configService: ConfigService) {
    // Verificar si el servicio de email está configurado
    this.emailEnabled = !!(
      this.configService.get('EMAIL_SERVICE') &&
      this.configService.get('EMAIL_USER')
    );

    if (!this.emailEnabled) {
      this.logger.warn(
        'Servicio de email no configurado. Los emails no se enviarán.',
      );
    }
  }

  /**
   * Enviar email genérico
   * @param dto - Datos del email
   */
  async sendEmail(
    dto: SendEmailDto,
  ): Promise<{ success: boolean; message: string }> {
    if (!this.emailEnabled) {
      this.logger.log(`Email simulado a: ${dto.to} - ${dto.subject}`);
      return { success: true, message: 'Email simulado (no configurado)' };
    }

    try {
      // TODO: Implementar servicio de email real (SendGrid, Mailgun, etc.)
      // Por ahora solo logueamos
      this.logger.log(`Enviando email a ${dto.to}: ${dto.subject}`);
      await Promise.resolve(); // Placeholder para await
      return { success: true, message: 'Email enviado' };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      this.logger.error(`Error enviando email: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Enviar email de confirmación de cita
   * @param email - Email del destinatario
   * @param data - Datos de la cita
   */
  async sendAppointmentConfirmation(email: string, data: AppointmentEmailData) {
    const subject = `Confirmación de tu cita en ${data.businessName}`;
    const html = this.getAppointmentConfirmationTemplate(data);

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  /**
   * Enviar email de recordatorio de cita
   * @param email - Email del destinatario
   * @param data - Datos de la cita
   */
  async sendAppointmentReminder(email: string, data: AppointmentEmailData) {
    const subject = `Recordatorio: Tu cita en ${data.businessName} es mañana`;
    const html = this.getAppointmentReminderTemplate(data);

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  /**
   * Enviar email de cancelación de cita
   * @param email - Email del destinatario
   * @param data - Datos de la cita
   */
  async sendAppointmentCancellation(email: string, data: AppointmentEmailData) {
    const subject = `Tu cita en ${data.businessName} ha sido cancelada`;
    const html = this.getAppointmentCancellationTemplate(data);

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  /**
   * Enviar email de reprogramación de cita
   * @param email - Email del destinatario
   * @param data - Datos de la cita
   */
  async sendAppointmentRescheduled(email: string, data: AppointmentEmailData) {
    const subject = `Tu cita en ${data.businessName} ha sido reprogramada`;
    const html = this.getAppointmentRescheduledTemplate(data);

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  /**
   * Plantilla HTML para confirmación de cita
   */
  private getAppointmentConfirmationTemplate(
    data: AppointmentEmailData,
  ): string {
    return `
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
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Cita Confirmada!</h1>
            </div>
            <div class="content">
              <p>Hola ${data.customerName},</p>
              <p>Tu cita ha sido confirmada exitosamente.</p>
              <div class="details">
                <h3>Detalles de la cita:</h3>
                <p><strong>Negocio:</strong> ${data.businessName}</p>
                <p><strong>Servicio:</strong> ${data.serviceName}</p>
                <p><strong>Fecha:</strong> ${data.date}</p>
                <p><strong>Hora:</strong> ${data.time}</p>
                ${data.address ? `<p><strong>Dirección:</strong> ${data.address}</p>` : ''}
                ${data.phone ? `<p><strong>Teléfono:</strong> ${data.phone}</p>` : ''}
              </div>
              <p>Te esperamos. Si necesitas cancelar o reprogramar, puedes hacerlo desde tu panel de turnos.</p>
            </div>
            <div class="footer">
              <p>Este es un email automático. Por favor no respondas a este mensaje.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Plantilla HTML para recordatorio de cita
   */
  private getAppointmentReminderTemplate(data: AppointmentEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #2196F3; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Recordatorio de Cita</h1>
            </div>
            <div class="content">
              <p>Hola ${data.customerName},</p>
              <p>Este es un recordatorio de que tienes una cita mañana.</p>
              <div class="details">
                <h3>Detalles de la cita:</h3>
                <p><strong>Negocio:</strong> ${data.businessName}</p>
                <p><strong>Servicio:</strong> ${data.serviceName}</p>
                <p><strong>Fecha:</strong> ${data.date}</p>
                <p><strong>Hora:</strong> ${data.time}</p>
                ${data.address ? `<p><strong>Dirección:</strong> ${data.address}</p>` : ''}
                ${data.phone ? `<p><strong>Teléfono:</strong> ${data.phone}</p>` : ''}
              </div>
              <p>¡No olvides tu cita!</p>
            </div>
            <div class="footer">
              <p>Este es un email automático. Por favor no respondas a este mensaje.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Plantilla HTML para cancelación de cita
   */
  private getAppointmentCancellationTemplate(
    data: AppointmentEmailData,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f44336; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #f44336; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Cita Cancelada</h1>
            </div>
            <div class="content">
              <p>Hola ${data.customerName},</p>
              <p>Tu cita ha sido cancelada.</p>
              <div class="details">
                <h3>Detalles de la cita cancelada:</h3>
                <p><strong>Negocio:</strong> ${data.businessName}</p>
                <p><strong>Servicio:</strong> ${data.serviceName}</p>
                <p><strong>Fecha:</strong> ${data.date}</p>
                <p><strong>Hora:</strong> ${data.time}</p>
              </div>
              <p>Si deseas agendar una nueva cita, puedes hacerlo desde nuestra plataforma.</p>
            </div>
            <div class="footer">
              <p>Este es un email automático. Por favor no respondas a este mensaje.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Plantilla HTML para reprogramación de cita
   */
  private getAppointmentRescheduledTemplate(
    data: AppointmentEmailData,
  ): string {
    return `
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
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Cita Reprogramada</h1>
            </div>
            <div class="content">
              <p>Hola ${data.customerName},</p>
              <p>Tu cita ha sido reprogramada exitosamente.</p>
              <div class="details">
                <h3>Nuevos detalles de la cita:</h3>
                <p><strong>Negocio:</strong> ${data.businessName}</p>
                <p><strong>Servicio:</strong> ${data.serviceName}</p>
                <p><strong>Nueva Fecha:</strong> ${data.date}</p>
                <p><strong>Nueva Hora:</strong> ${data.time}</p>
                ${data.address ? `<p><strong>Dirección:</strong> ${data.address}</p>` : ''}
                ${data.phone ? `<p><strong>Teléfono:</strong> ${data.phone}</p>` : ''}
              </div>
              <p>Te esperamos en la nueva fecha y hora.</p>
            </div>
            <div class="footer">
              <p>Este es un email automático. Por favor no respondas a este mensaje.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
