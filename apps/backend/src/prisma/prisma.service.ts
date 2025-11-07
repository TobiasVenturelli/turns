/**
 * @file prisma.service.ts
 * @description Servicio de Prisma para gestionar la conexión a la base de datos
 * @author Turns Team
 * @created 2025-11-07
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * Conectar a la base de datos al inicializar el módulo
   */
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma conectado a la base de datos');
  }

  /**
   * Desconectar de la base de datos al destruir el módulo
   */
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔌 Prisma desconectado de la base de datos');
  }

  /**
   * Limpiar la base de datos (útil para tests)
   */
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('No se puede limpiar la base de datos en producción');
    }

    // Eliminar en orden para respetar las relaciones
    await this.appointment.deleteMany();
    await this.schedule.deleteMany();
    await this.service.deleteMany();
    await this.business.deleteMany();
    await this.user.deleteMany();

    console.log('🗑️  Base de datos limpiada');
  }
}
