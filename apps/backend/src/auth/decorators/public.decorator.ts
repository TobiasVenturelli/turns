/**
 * @file public.decorator.ts
 * @description Decorador para marcar rutas como públicas
 * @author Turns Team
 * @created 2025-11-07
 */

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorador para marcar una ruta como pública (sin autenticación)
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
