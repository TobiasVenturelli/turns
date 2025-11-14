/**
 * @file websockets.gateway.ts
 * @description Gateway de WebSockets para sincronización en tiempo real
 * @author Turns Team
 * @created 2025-11-14
 */

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
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

interface AuthenticatedSocket extends Socket {
  userId?: string;
  businessId?: string;
  userRole?: string;
}

type JwtPayload = {
  sub: string;
  email?: string;
  role?: string;
};

@WebSocketGateway({
  cors: {
    origin: '*', // En producción, especificar dominios permitidos
    credentials: true,
  },
  namespace: '/',
})
export class WebSocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebSocketsGateway.name);
  private readonly connectedClients = new Map<string, AuthenticatedSocket>();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  /**
   * Maneja la conexión de un cliente
   */
  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Autenticar el socket usando el token JWT
      const token = this.extractTokenFromSocket(client);
      if (!token) {
        this.logger.warn(`Cliente ${client.id} intentó conectarse sin token`);
        client.disconnect();
        return;
      }

      // Verificar y decodificar el token
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      if (!jwtSecret) {
        this.logger.error('JWT_SECRET no configurado');
        client.disconnect();
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payloadRaw = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
      });
      const payload = payloadRaw as JwtPayload;

      const userId: string = payload.sub;
      if (!userId) {
        this.logger.warn('Token JWT no contiene userId');
        client.disconnect();
        return;
      }

      // Obtener información del usuario y negocio

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { business: true },
      });

      if (!user) {
        this.logger.warn(`Usuario ${userId} no encontrado`);
        client.disconnect();
        return;
      }

      // Asignar información al socket
      client.userId = user.id;
      client.userRole = user.role;
      client.businessId = user.business?.id;

      // Guardar cliente conectado
      this.connectedClients.set(client.id, client);

      // Si es profesional, unirse al room de su negocio
      if (user.role === 'PROFESSIONAL' && user.business?.id) {
        const roomName = `business:${user.business.id}`;
        await client.join(roomName);
        this.logger.log(`Profesional ${user.id} se unió al room ${roomName}`);
      }

      // Si es cliente, unirse a los rooms de los negocios donde tiene turnos
      if (user.role === 'CUSTOMER') {
        const appointments = await this.prisma.appointment.findMany({
          where: { customerId: user.id },
          select: { businessId: true },
          distinct: ['businessId'],
        });

        for (const appointment of appointments) {
          if (appointment.businessId) {
            const roomName = `business:${appointment.businessId}`;
            await client.join(roomName);
            this.logger.log(`Cliente ${user.id} se unió al room ${roomName}`);
          }
        }
      }

      this.logger.log(`Cliente ${client.id} conectado (Usuario: ${user.id})`);
    } catch (error) {
      this.logger.error(`Error al conectar cliente ${client.id}:`, error);
      client.disconnect();
    }
  }

  /**
   * Maneja la desconexión de un cliente
   */
  handleDisconnect(client: AuthenticatedSocket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Cliente ${client.id} desconectado`);
  }

  /**
   * Extrae el token JWT del socket
   */
  private extractTokenFromSocket(client: Socket): string | null {
    // Intentar obtener el token de los query params
    const authToken = client.handshake.auth?.token as string | undefined;
    const queryToken = client.handshake.query?.token as string | undefined;
    const token = authToken || queryToken;
    if (typeof token === 'string') {
      return token;
    }
    return null;
  }

  /**
   * Emite un evento a todos los clientes de un negocio
   */
  emitToBusiness(businessId: string, event: string, data: unknown) {
    const roomName = `business:${businessId}`;
    this.server.to(roomName).emit(event, data);
    this.logger.log(`Evento ${event} emitido al room ${roomName}`);
  }

  /**
   * Emite un evento a un cliente específico
   */
  emitToUser(userId: string, event: string, data: unknown) {
    const client = Array.from(this.connectedClients.values()).find(
      (c) => c.userId === userId,
    );
    if (client) {
      client.emit(event, data);
      this.logger.log(`Evento ${event} emitido al usuario ${userId}`);
    }
  }

  /**
   * Emite un evento cuando se crea un turno
   */
  emitAppointmentCreated(
    businessId: string,
    appointment: AppointmentWithRelations,
  ) {
    this.emitToBusiness(businessId, 'appointment:created', {
      appointment,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Emite un evento cuando se actualiza un turno
   */
  emitAppointmentUpdated(
    businessId: string,
    appointment: AppointmentWithRelations,
  ) {
    this.emitToBusiness(businessId, 'appointment:updated', {
      appointment,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Emite un evento cuando se cancela un turno
   */
  emitAppointmentCancelled(
    businessId: string,
    appointment: AppointmentWithRelations,
  ) {
    this.emitToBusiness(businessId, 'appointment:cancelled', {
      appointment,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Emite un evento cuando se confirma un pago
   */
  emitPaymentConfirmed(businessId: string, payment: PaymentData) {
    this.emitToBusiness(businessId, 'payment:confirmed', {
      payment,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Emite un evento cuando se reembolsa un pago
   */
  emitPaymentRefunded(businessId: string, payment: PaymentData) {
    this.emitToBusiness(businessId, 'payment:refunded', {
      payment,
      timestamp: new Date().toISOString(),
    });
  }
}
