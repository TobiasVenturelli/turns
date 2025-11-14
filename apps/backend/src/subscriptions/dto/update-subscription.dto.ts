import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubscriptionDto {
  @ApiProperty({
    description: 'ID del nuevo plan de suscripción',
    example: 'clxxx123456789',
    required: false,
  })
  @IsString()
  @IsOptional()
  planId?: string;

  @ApiProperty({
    description: 'Cancelar al final del período',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  cancelAtPeriodEnd?: boolean;
}
