/**
 * @file app.controller.spec.ts
 * @description Tests para el controlador principal
 * @author Turns Team
 * @created 2025-11-07
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health check', () => {
    it('debe retornar el estado de la API', () => {
      const result = appController.getHealthCheck();

      expect(result).toBeDefined();
      expect(result.status).toBe('ok');
      expect(result.message).toBe('Turns API is running');
      expect(result.version).toBe('1.0.0');
      expect(result.timestamp).toBeDefined();
    });

    it('debe tener la estructura correcta', () => {
      const result = appController.getHealthCheck();

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('timestamp');
    });
  });
});
