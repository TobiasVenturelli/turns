import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'ID del plan de suscripción',
    example: 'clxxx123456789',
  })
  @IsString()
  @IsNotEmpty()
  planId: string;
}
