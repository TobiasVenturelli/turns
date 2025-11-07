/**
 * @file jwt.config.ts
 * @description Configuración centralizada de JWT
 * @author Turns Team
 * @created 2025-11-07
 */

import { ConfigService } from '@nestjs/config';

/**
 * Obtener secreto de JWT Access con valor por defecto
 */
export const getJwtAccessSecret = (configService: ConfigService): string => {
  return (
    configService.get<string>('JWT_ACCESS_SECRET') ||
    'default-jwt-access-secret-change-in-production'
  );
};

/**
 * Obtener secreto de JWT Refresh con valor por defecto
 */
export const getJwtRefreshSecret = (configService: ConfigService): string => {
  return (
    configService.get<string>('JWT_REFRESH_SECRET') ||
    'default-jwt-refresh-secret-change-in-production'
  );
};

/**
 * Obtener expiración de JWT Access con valor por defecto
 */
export const getJwtAccessExpiresIn = (configService: ConfigService): string => {
  return configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m';
};

/**
 * Obtener expiración de JWT Refresh con valor por defecto
 */
export const getJwtRefreshExpiresIn = (
  configService: ConfigService,
): string => {
  return configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';
};
