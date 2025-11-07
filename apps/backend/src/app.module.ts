/**
 * @file app.module.ts
 * @description Módulo raíz de la aplicación
 * @author Turns Team
 * @created 2025-11-07
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BusinessesModule } from './businesses/businesses.module';
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // Hace que el ConfigModule esté disponible en todos los módulos
      envFilePath: '.env', // Ruta al archivo .env
    }),

    // Configuración de rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // Tiempo en milisegundos (60 segundos)
        limit: 100, // Número máximo de requests en el TTL
      },
    ]),

    // Prisma Database
    PrismaModule,

    // Autenticación
    AuthModule,

    // Usuarios
    UsersModule,

    // Negocios (públicos)
    BusinessesModule,

    // Citas/Turnos
    AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
