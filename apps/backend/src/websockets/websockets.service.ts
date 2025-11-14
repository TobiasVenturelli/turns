/**
 * @file websockets.service.ts
 * @description Servicio para gestionar eventos de WebSockets
 * @author Turns Team
 * @created 2025-11-14
 */

import { Injectable } from '@nestjs/common';
import { WebSocketsGateway } from './websockets.gateway';
import type { Appointment, Service, Business, User } from '@prisma/client';

type AppointmentWithRelations = Appointment & {
  service?: Service;
  business?: Business;
  customer?: Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'phone'>;
};

interface PaymentData {
  paymentId: string;
  appointmentId: string;
  amount?: number;
  status?: string;
  appointment?: AppointmentWithRelations;
  refundAmount?: number;
}

@Injectable()
export class WebSocketsService {
  constructor(private gateway: WebSocketsGateway) {}

  /**
   * Notifica cuando se crea un nuevo turno
   */
  notifyAppointmentCreated(
    businessId: string,
    appointment: AppointmentWithRelations,
  ) {
    this.gateway.emitAppointmentCreated(businessId, appointment);
  }

  /**
   * Notifica cuando se actualiza un turno
   */
  notifyAppointmentUpdated(
    businessId: string,
    appointment: AppointmentWithRelations,
  ) {
    this.gateway.emitAppointmentUpdated(businessId, appointment);
  }

  /**
   * Notifica cuando se cancela un turno
   */
  notifyAppointmentCancelled(
    businessId: string,
    appointment: AppointmentWithRelations,
  ) {
    this.gateway.emitAppointmentCancelled(businessId, appointment);
  }

  /**
   * Notifica cuando se confirma un pago
   */
  notifyPaymentConfirmed(businessId: string, payment: PaymentData) {
    this.gateway.emitPaymentConfirmed(businessId, payment);
  }

  /**
   * Notifica cuando se reembolsa un pago
   */
  notifyPaymentRefunded(businessId: string, payment: PaymentData) {
    this.gateway.emitPaymentRefunded(businessId, payment);
  }
}
