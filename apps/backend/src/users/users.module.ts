/**
 * @file users.module.ts
 * @description Módulo de usuarios
 * @author Turns Team
 * @created 2025-11-07
 */

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
