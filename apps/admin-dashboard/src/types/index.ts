/**
 * @file index.ts
 * @description Tipos TypeScript compartidos
 */

// Usuario
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'CUSTOMER' | 'PROFESSIONAL' | 'ADMIN';
  profileImage?: string;
  googleId?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Suscripción
export interface Subscription {
  id: string;
  businessId: string;
  status: 'TRIAL' | 'ACTIVE' | 'EXPIRED';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt?: string | null;
  mercadopagoSubscriptionId?: string | null;
  mercadopagoPreapprovalId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Negocio
export interface Business {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
  phone?: string;
  email?: string;
  logo?: string;
  photos: string[];
  isActive: boolean;
  userId: string;
  subscription?: Subscription;
  createdAt: string;
  updatedAt: string;
}

// Servicio
export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category?: string; // Categoría del servicio (ej: "Corte", "Color", "Tratamiento")
  imageUrl?: string; // URL de la imagen del servicio
  isActive: boolean;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

// Turno/Cita
export interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  notes?: string;
  customerId: string;
  serviceId: string;
  businessId: string;
  customer: User;
  service: Service;
  createdAt: string;
  updatedAt: string;
}

// Horario
export interface Schedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

// Estadísticas del Dashboard
export interface DashboardStats {
  todayAppointments: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  pendingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalCustomers: number;
}

// DTOs
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface CreateAppointmentDto {
  date: string;
  startTime: string;
  endTime: string;
  customerId: string;
  serviceId: string;
  notes?: string;
}

export interface UpdateAppointmentDto {
  date?: string;
  startTime?: string;
  endTime?: string;
  status?: Appointment['status'];
  notes?: string;
}

export interface CreateServiceDto {
  name: string;
  description?: string;
  price: number;
  duration: number;
  businessId: string;
}

export interface UpdateServiceDto {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  isActive?: boolean;
}

