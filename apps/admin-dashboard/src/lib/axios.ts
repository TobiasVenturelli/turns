/**
 * @file axios.ts
 * @description Cliente HTTP configurado con interceptores
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Crear instancia de axios
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request - Agregar token automáticamente
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Obtener token del localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response - Manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Si el token expiró (401)
    if (error.response?.status === 401) {
      // Intentar refrescar el token
      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('admin_refresh_token');
        
        if (refreshToken) {
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
            const response = await axios.post(
              `${apiUrl}/auth/refresh`,
              { refreshToken }
            );

            const { accessToken } = response.data;
            localStorage.setItem('admin_access_token', accessToken);

            // Reintentar la petición original
            if (error.config) {
              error.config.headers.Authorization = `Bearer ${accessToken}`;
              return api.request(error.config);
            }
          } catch (refreshError) {
            // Si falla el refresh, limpiar tokens y redirigir al login
            localStorage.removeItem('admin_access_token');
            localStorage.removeItem('admin_refresh_token');
            localStorage.removeItem('admin_user');
            window.location.href = '/login';
          }
        } else {
          // No hay refresh token, redirigir al login
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

