/**
 * @file payments.module.ts
 * @description Módulo de pagos
 * @author Turns Team
 * @created 2025-11-08
 */

import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController, WebhooksController } from './payments.controller';
import { MercadoPagoService } from './mercadopago.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { WebSocketsModule } from '../websockets/websockets.module';

@Module({
  imports: [PrismaModule, NotificationsModule, WebSocketsModule],
  controllers: [PaymentsController, WebhooksController],
  providers: [PaymentsService, MercadoPagoService],
  exports: [PaymentsService, MercadoPagoService],
})
export class PaymentsModule {}
