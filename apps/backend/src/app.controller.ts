/**
 * @file app.controller.ts
 * @description Controlador principal de la aplicación
 * @author Turns Team
 * @created 2025-11-07
 */

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Endpoint de health check
   * @returns Información del estado de la API
   */
  @Get()
  getHealthCheck() {
    return this.appService.getHealthCheck();
  }
}
