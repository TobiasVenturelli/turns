/**
 * @file useAuth.ts
 * @description Hook personalizado para autenticación
 * @author Turns Team
 * @created 2025-11-07
 */

'use client';

import { useAuthStore } from '@/stores/auth.store';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { LoginCredentials, RegisterData } from '@/types';

export const useAuth = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setAuth, clearAuth, setLoading, setUser } = useAuthStore();

  // Verificar autenticación al montar
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const user = await authService.getCurrentUser();
        setUser(user);
        setLoading(false);
      } catch {
        clearAuth();
        setLoading(false);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      setAuth(response.user, response.accessToken, response.refreshToken);
      router.push('/dashboard');
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      setAuth(response.user, response.accessToken, response.refreshToken);
      router.push('/dashboard');
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      clearAuth();
      router.push('/login');
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };
};

