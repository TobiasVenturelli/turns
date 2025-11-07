/**
 * @file jwt-refresh.guard.ts
 * @description Guard para refresh tokens
 * @author Turns Team
 * @created 2025-11-07
 */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
