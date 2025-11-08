/**
 * @file update-business.dto.ts
 * @description DTO para actualizar un negocio
 * @author Turns Team
 * @created 2025-11-08
 */

import { PartialType } from '@nestjs/mapped-types';
import { CreateBusinessDto } from './create-business.dto';

export class UpdateBusinessDto extends PartialType(CreateBusinessDto) {}
