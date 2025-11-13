/**
 * @file mockData.ts
 * @description Datos mock para tests
 * @author Turns Team
 * @created 2025-11-08
 */

import type {
  BusinessWithRelations,
  Appointment,
  User,
} from '@/types';
import { UserRole, AuthProvider, AppointmentStatus } from '@/types';

export const mockUser: User = {
  id: 'user-1',
  email: 'cliente@test.com',
  firstName: 'Juan',
  lastName: 'Pérez',
  phone: '+54911111111',
  avatar: null,
  role: UserRole.CUSTOMER,
  authProvider: AuthProvider.LOCAL,
  emailVerified: true,
  createdAt: '2025-11-01T00:00:00Z',
  updatedAt: '2025-11-01T00:00:00Z',
};

export const mockBusiness: BusinessWithRelations = {
  id: 'business-1',
  name: 'Peluquería María',
  slug: 'peluqueria-maria',
  description: 'Servicios profesionales de belleza y cuidado personal',
  logo: 'https://example.com/logo.png',
  phone: '+54911111111',
  email: 'maria@peluqueria.com',
  address: 'Av. Corrientes 1234',
  city: 'Buenos Aires',
  state: 'CABA',
  country: 'Argentina',
  zipCode: '1043',
  latitude: -34.6037,
  longitude: -58.3816,
  isActive: true,
  rating: 4.5,
  reviewCount: 24,
  createdAt: '2025-11-01T00:00:00Z',
  updatedAt: '2025-11-01T00:00:00Z',
  services: [
    {
      id: 'service-1',
      businessId: 'business-1',
      name: 'Corte de Dama',
      description: 'Corte moderno y profesional',
      duration: 30,
      price: 5000,
      isActive: true,
      createdAt: '2025-11-01T00:00:00Z',
      updatedAt: '2025-11-01T00:00:00Z',
    },
    {
      id: 'service-2',
      businessId: 'business-1',
      name: 'Corte y Peinado',
      description: 'Corte con peinado incluido',
      duration: 60,
      price: 8000,
      isActive: true,
      createdAt: '2025-11-01T00:00:00Z',
      updatedAt: '2025-11-01T00:00:00Z',
    },
  ],
  schedules: [
    {
      id: 'schedule-1',
      businessId: 'business-1',
      dayOfWeek: 1, // Lunes
      startTime: '09:00',
      endTime: '18:00',
      isActive: true,
      createdAt: '2025-11-01T00:00:00Z',
      updatedAt: '2025-11-01T00:00:00Z',
    },
    {
      id: 'schedule-2',
      businessId: 'business-1',
      dayOfWeek: 2, // Martes
      startTime: '09:00',
      endTime: '18:00',
      isActive: true,
      createdAt: '2025-11-01T00:00:00Z',
      updatedAt: '2025-11-01T00:00:00Z',
    },
  ],
  user: {
    firstName: 'María',
    lastName: 'González',
    avatar: null,
  },
};

export const mockAppointment: Appointment = {
  id: 'appointment-1',
  businessId: 'business-1',
  serviceId: 'service-1',
  customerId: 'user-1',
  professionalId: 'professional-1',
  startTime: '2025-11-15T10:00:00Z',
  endTime: '2025-11-15T10:30:00Z',
  status: AppointmentStatus.CONFIRMED,
  notes: null,
  createdAt: '2025-11-08T00:00:00Z',
  updatedAt: '2025-11-08T00:00:00Z',
};

