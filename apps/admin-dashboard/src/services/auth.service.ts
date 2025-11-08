/**
 * @file auth.service.ts
 * @description Servicio de autenticación para profesionales
 */

import api from '@/lib/axios';
import { API_ROUTES } from '@/config/api';
import { LoginDto, RegisterDto, User } from '@/types';

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  /**
   * Login con email y contraseña
   */
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      API_ROUTES.AUTH.LOGIN,
      credentials
    );
    return response.data;
  },

  /**
   * Login con Google
   */
  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      API_ROUTES.AUTH.GOOGLE_LOGIN,
      { idToken }
    );
    return response.data;
  },

  /**
   * Registro de nuevo profesional
   */
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      API_ROUTES.AUTH.REGISTER,
      {
        ...data,
        role: 'PROFESSIONAL', // Importante: registrar como PROFESSIONAL
      }
    );
    return response.data;
  },

  /**
   * Obtener usuario actual
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>(API_ROUTES.AUTH.ME);
    return response.data;
  },

  /**
   * Refrescar token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await api.post<{ accessToken: string }>(
      API_ROUTES.AUTH.REFRESH,
      { refreshToken }
    );
    return response.data;
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await api.post(API_ROUTES.AUTH.LOGOUT);
  },
};

