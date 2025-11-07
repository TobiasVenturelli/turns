/**
 * @file jwt.strategy.ts
 * @description Estrategia JWT para validar access tokens
 * @author Turns Team
 * @created 2025-11-07
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { getJwtAccessSecret } from '../../common/config/jwt.config';
import { JwtPayload } from '../types/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: getJwtAccessSecret(configService),
      ignoreExpiration: false,
    });
  }

  /**
   * Validar el payload del token
   * @param payload - Payload del JWT
   * @returns Usuario validado
   */
  async validate(payload: JwtPayload) {
    const user = await this.authService.validateUser(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }

    return user;
  }
}
