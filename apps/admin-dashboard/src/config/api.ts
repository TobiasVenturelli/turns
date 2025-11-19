/**
 * @file api.ts
 * @description Configuración de URLs de API
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000',
  TIMEOUT: 10000,
};

export const API_ROUTES = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    GOOGLE_LOGIN: '/auth/google',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },

  // Business
  BUSINESS: {
    MY_BUSINESS: '/businesses/my-business',
    UPDATE: '/businesses',
    UPLOAD_LOGO: '/businesses/logo',
    UPLOAD_PHOTOS: '/businesses/photos',
  },

  // Appointments
  APPOINTMENTS: {
    LIST: '/appointments/professional/appointments',
    CREATE: '/appointments',
    UPDATE: (id: string) => `/appointments/${id}`,
    DELETE: (id: string) => `/appointments/${id}`,
    STATS: '/appointments/professional/stats',
  },

  // Services
  SERVICES: {
    LIST: (businessId: string) => `/services/business/${businessId}`,
    CREATE: (businessId: string) => `/services/business/${businessId}`,
    UPDATE: (id: string) => `/services/${id}`,
    DELETE: (id: string) => `/services/${id}`,
  },

  // Customers
  CUSTOMERS: {
    LIST: '/appointments/professional/customers',
    GET: (id: string) => `/users/${id}`,
  },

  // Schedule
  SCHEDULE: {
    GET: (businessId: string) => `/schedules/business/${businessId}`,
    UPDATE: '/schedules',
  },
};

