/**
 * @file users.service.ts
 * @description Servicio para gestión de usuarios
 * @author Turns Team
 * @created 2025-11-07
 */

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtener perfil del usuario por ID
   * @param userId - ID del usuario
   * @returns Perfil del usuario
   */
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        authProvider: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        // Incluir business si es profesional
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            logo: true,
            phone: true,
            email: true,
            address: true,
            city: true,
            shareableLink: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  /**
   * Actualizar perfil del usuario
   * @param userId - ID del usuario
   * @param updateProfileDto - Datos a actualizar
   * @returns Usuario actualizado
   */
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    // Verificar que el usuario existe
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Actualizar usuario
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateProfileDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        authProvider: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  /**
   * Cambiar contraseña del usuario
   * @param userId - ID del usuario
   * @param changePasswordDto - Contraseñas actual y nueva
   * @returns Mensaje de éxito
   */
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    // Buscar usuario
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar que el usuario tenga contraseña (no OAuth)
    if (!user.password) {
      throw new BadRequestException(
        'No puedes cambiar la contraseña de una cuenta OAuth',
      );
    }

    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    // Actualizar contraseña
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return {
      message: 'Contraseña actualizada exitosamente',
    };
  }

  /**
   * Eliminar cuenta del usuario
   * @param userId - ID del usuario
   * @returns Mensaje de éxito
   */
  async deleteAccount(userId: string) {
    // Verificar que el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        business: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Si es profesional y tiene un negocio, eliminar todo en cascada
    // (Prisma ya maneja esto con onDelete: Cascade en el schema)
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return {
      message: 'Cuenta eliminada exitosamente',
    };
  }

  /**
   * Buscar usuario por email (uso interno)
   * @param email - Email del usuario
   * @returns Usuario encontrado
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Buscar usuario por ID (uso interno)
   * @param id - ID del usuario
   * @returns Usuario encontrado
   */
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Listar todos los usuarios (admin)
   * @returns Lista de usuarios
   */
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        authProvider: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
