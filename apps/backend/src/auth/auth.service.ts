/**
 * @file auth.service.ts
 * @description Servicio de autenticación con JWT y Google OAuth
 * @author Turns Team
 * @created 2025-11-07
 */

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User, AuthProvider } from '@prisma/client';
import {
  getJwtAccessSecret,
  getJwtRefreshSecret,
  getJwtAccessExpiresIn,
  getJwtRefreshExpiresIn,
} from '../common/config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Registrar un nuevo usuario
   * @param registerDto - Datos de registro
   * @returns Usuario creado y tokens
   */
  async register(registerDto: RegisterDto) {
    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear usuario
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        phone: registerDto.phone,
        role: registerDto.role || 'CUSTOMER',
        authProvider: AuthProvider.LOCAL,
      },
    });

    // Si es profesional, crear negocio y suscripción con trial de 7 días
    if (user.role === 'PROFESSIONAL') {
      await this.createBusinessAndSubscription(user);
    }

    // Generar tokens
    const tokens = await this.generateTokens(user);

    // Guardar refresh token
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Crear negocio y suscripción con trial de 7 días para profesionales
   * @param user - Usuario profesional
   */
  private async createBusinessAndSubscription(user: User) {
    // Generar slug único para el negocio
    const baseSlug =
      `${user.firstName.toLowerCase()}-${user.lastName.toLowerCase()}`
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-');

    let slug = baseSlug;
    let counter = 1;

    // Verificar que el slug sea único
    while (await this.prisma.business.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Crear negocio
    const business = await this.prisma.business.create({
      data: {
        name: `${user.firstName} ${user.lastName}`,
        slug,
        phone: user.phone || '',
        email: user.email,
        userId: user.id,
        shareableLink: `turns.app/${slug}`,
      },
    });

    // Crear suscripción con trial de 7 días (Plan Pro - único plan disponible)
    const now = new Date();
    const trialEndsAt = new Date(now);
    trialEndsAt.setDate(trialEndsAt.getDate() + 7); // 7 días de trial

    // Obtener el plan Pro (único plan disponible)
    const proPlan = await this.prisma.subscriptionPlan.findFirst({
      where: { name: 'Pro' },
    });

    if (proPlan) {
      await this.prisma.subscription.create({
        data: {
          businessId: business.id,
          planId: proPlan.id,
          status: 'TRIAL',
          currentPeriodStart: now,
          currentPeriodEnd: trialEndsAt,
          trialEndsAt,
        },
      });
    }
  }

  /**
   * Iniciar sesión
   * @param loginDto - Credenciales de login
   * @returns Usuario y tokens
   */
  async login(loginDto: LoginDto) {
    // Buscar usuario
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar tokens
    const tokens = await this.generateTokens(user);

    // Actualizar refresh token
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Refrescar tokens
   * @param userId - ID del usuario
   * @param refreshToken - Refresh token
   * @returns Nuevos tokens
   */
  async refreshTokens(userId: string, refreshToken: string) {
    // Buscar usuario
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Acceso denegado');
    }

    // Verificar refresh token
    const isTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isTokenValid) {
      throw new UnauthorizedException('Acceso denegado');
    }

    // Generar nuevos tokens
    const tokens = await this.generateTokens(user);

    // Actualizar refresh token
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  /**
   * Cerrar sesión
   * @param userId - ID del usuario
   */
  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { message: 'Sesión cerrada exitosamente' };
  }

  /**
   * Generar access y refresh tokens
   * @param user - Usuario
   * @returns Tokens
   */
  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: getJwtAccessSecret(this.configService),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        expiresIn: getJwtAccessExpiresIn(this.configService) as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: getJwtRefreshSecret(this.configService),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        expiresIn: getJwtRefreshExpiresIn(this.configService) as any,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Actualizar refresh token en la base de datos
   * @param userId - ID del usuario
   * @param refreshToken - Refresh token
   */
  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  /**
   * Remover datos sensibles del usuario
   * @param user - Usuario
   * @returns Usuario sin datos sensibles
   */
  private sanitizeUser(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, resetPasswordToken, ...sanitized } = user;
    return sanitized;
  }

  /**
   * Validar usuario por ID
   * @param userId - ID del usuario
   * @returns Usuario
   */
  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return this.sanitizeUser(user);
  }
}
