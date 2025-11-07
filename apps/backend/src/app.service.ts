/**
 * @file app.service.ts
 * @description Servicio principal de la aplicación
 * @author Turns Team
 * @created 2025-11-07
 */

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Retorna el estado de salud de la API
   * @returns Objeto con información de la API
   */
  getHealthCheck() {
    return {
      status: 'ok',
      message: 'Turns API is running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
