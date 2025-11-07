/**
 * @file prisma.module.ts
 * @description Módulo de Prisma para inyección en toda la aplicación
 * @author Turns Team
 * @created 2025-11-07
 */

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Hace que el módulo esté disponible globalmente
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
