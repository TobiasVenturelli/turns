/**
 * @file websockets.module.ts
 * @description Módulo de WebSockets
 * @author Turns Team
 * @created 2025-11-14
 */

import { Module } from '@nestjs/common';
import { WebSocketsGateway } from './websockets.gateway';
import { WebSocketsService } from './websockets.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, JwtModule, ConfigModule],
  providers: [WebSocketsGateway, WebSocketsService],
  exports: [WebSocketsService],
})
export class WebSocketsModule {}
