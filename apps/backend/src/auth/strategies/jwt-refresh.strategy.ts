/**
 * @file jwt-refresh.strategy.ts
 * @description Estrategia JWT para validar refresh tokens
 * @author Turns Team
 * @created 2025-11-07
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { getJwtRefreshSecret } from '../../common/config/jwt.config';
import { JwtPayload, RefreshTokenUser } from '../types/jwt-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: getJwtRefreshSecret(configService),
      passReqToCallback: true,
    });
  }

  /**
   * Validar el payload del refresh token
   * @param req - Request de Express
   * @param payload - Payload del JWT
   * @returns Usuario y refresh token
   */
  validate(req: Request, payload: JwtPayload): RefreshTokenUser {
    const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token no encontrado');
    }

    return {
      userId: payload.sub,
      refreshToken,
    };
  }
}
