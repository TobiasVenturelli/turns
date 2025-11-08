/**
 * @file send-email.dto.ts
 * @description DTO para enviar email
 * @author Turns Team
 * @created 2025-11-08
 */

import { IsString, IsEmail, IsOptional } from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  html?: string;
}
