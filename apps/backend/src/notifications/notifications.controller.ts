/**
 * @file notifications.controller.ts
 * @description Controlador de notificaciones (para testing/admin)
 * @author Turns Team
 * @created 2025-11-08
 */

import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SendEmailDto } from './dto/send-email.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Enviar email de prueba (solo para testing)
   * En producción, este endpoint debería estar protegido o deshabilitado
   */
  @Public()
  @Post('test-email')
  async sendTestEmail(@Body() dto: SendEmailDto) {
    return this.notificationsService.sendEmail(dto);
  }
}
