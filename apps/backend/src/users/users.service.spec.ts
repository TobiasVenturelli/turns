/**
 * @file users.service.spec.ts
 * @description Tests para el servicio de usuarios
 * @author Turns Team
 * @created 2025-11-07
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, AuthProvider } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = {
    id: '123',
    email: 'test@test.com',
    password: 'hashedPassword',
    firstName: 'Test',
    lastName: 'User',
    phone: '+54911111111',
    avatar: null,
    role: UserRole.CUSTOMER,
    authProvider: AuthProvider.LOCAL,
    googleId: null,
    emailVerified: true,
    emailVerifiedAt: new Date(),
    refreshToken: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('debe retornar el perfil del usuario', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getProfile('123');

      expect(result).toBeDefined();
      expect(result.id).toBe('123');

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        select: expect.any(Object),
      });
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile('999')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getProfile('999')).rejects.toThrow(
        'Usuario no encontrado',
      );
    });
  });

  describe('updateProfile', () => {
    it('debe actualizar el perfil del usuario', async () => {
      const updateDto = {
        firstName: 'Nuevo',
        lastName: 'Nombre',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        ...updateDto,
      });

      const result = await service.updateProfile('123', updateDto);

      expect(result).toBeDefined();
      expect(result.firstName).toBe('Nuevo');
      expect(result.lastName).toBe('Nombre');
      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.updateProfile('999', { firstName: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteAccount', () => {
    it('debe eliminar la cuenta del usuario', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      const result = await service.deleteAccount('123');

      expect(result).toBeDefined();
      expect(result.message).toBe('Cuenta eliminada exitosamente');
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: '123' },
      });
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.deleteAccount('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByEmail', () => {
    it('debe encontrar un usuario por email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@test.com');

      expect(result).toBeDefined();
      expect(result?.email).toBe('test@test.com');
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
    });

    it('debe retornar null si el usuario no existe', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findByEmail('noexiste@test.com');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('debe retornar todos los usuarios', async () => {
      const users = [
        mockUser,
        { ...mockUser, id: '456', email: 'otro@test.com' },
      ];
      mockPrismaService.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
    });
  });
});
