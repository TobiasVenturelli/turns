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
import { ServicesModule } from './services/services.module';
import { SchedulesModule } from './schedules/schedules.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { WebSocketsModule } from './websockets/websockets.module';

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

    // Servicios
    ServicesModule,

    // Horarios
    SchedulesModule,

    // Notificaciones
    NotificationsModule,

    // Citas/Turnos
    AppointmentsModule,

    // Pagos
    PaymentsModule,

    // Suscripciones
    SubscriptionsModule,

    // WebSockets
    WebSocketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
