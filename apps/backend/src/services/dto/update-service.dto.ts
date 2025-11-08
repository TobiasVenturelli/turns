/**
 * @file update-service.dto.ts
 * @description DTO para actualizar un servicio
 * @author Turns Team
 * @created 2025-11-08
 */

import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
