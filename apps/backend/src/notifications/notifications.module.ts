/**
 * @file notifications.module.ts
 * @description Módulo de notificaciones
 * @author Turns Team
 * @created 2025-11-08
 */

import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
