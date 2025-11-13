/**
 * @file types/index.ts
 * @description Tipos TypeScript para el proyecto
 * @author Turns Team
 * @created 2025-11-07
 */

// Enums
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  PROFESSIONAL = 'PROFESSIONAL',
  ADMIN = 'ADMIN',
}

export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  avatar: string | null;
  role: UserRole;
  authProvider: AuthProvider;
  googleId?: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Business types
export interface Business {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipCode: string | null;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessWithRelations extends Business {
  services: Service[];
  schedules: Schedule[];
  mercadopagoEnabled?: boolean;
  user: {
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
}

// Service types
export interface Service {
  id: string;
  businessId: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Schedule types
export interface Schedule {
  id: string;
  businessId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Appointment types
export interface Appointment {
  id: string;
  businessId: string;
  serviceId: string;
  customerId: string;
  professionalId: string | null;
  startTime: string;
  endTime: string;
  status: AppointmentStatus | 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string | null;
  isPaid?: boolean;
  paymentMethod?: string | null;
  mercadopagoPaymentId?: string | null;
  createdAt: string;
  updatedAt: string;
  service?: Service;
  customer?: User;
  professional?: User;
  business?: Business;
}

export interface AppointmentWithRelations extends Appointment {
  service: Service;
  customer: User;
  business: Business;
  professional?: User;
}

// API Response types
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

