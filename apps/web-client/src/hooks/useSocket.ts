/**
 * @file useSocket.ts
 * @description Hook para conectar con el servidor de WebSockets (Web Client)
 * @author Turns Team
 * @created 2025-11-14
 */

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/auth.store';

const WS_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { accessToken, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Solo conectar si está autenticado
    if (!isAuthenticated || !accessToken) {
      return;
    }

    // Conectar al servidor de WebSockets
    const socket = io(WS_URL, {
      auth: {
        token: accessToken,
      },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    // Eventos de conexión
    socket.on('connect', () => {
      console.log('✅ Conectado al servidor de WebSockets');
    });

    socket.on('disconnect', () => {
      console.log('❌ Desconectado del servidor de WebSockets');
    });

    socket.on('connect_error', (error) => {
      console.error('Error de conexión WebSocket:', error);
    });

    // Eventos de turnos (solo para clientes autenticados)
    socket.on('appointment:updated', (data: { appointment: any }) => {
      console.log('Turno actualizado:', data);
      // Aquí se puede actualizar el estado local si es necesario
    });

    socket.on('appointment:cancelled', (data: { appointment: any }) => {
      console.log('Turno cancelado:', data);
      // Aquí se puede actualizar el estado local si es necesario
    });

    // Eventos de pagos
    socket.on('payment:confirmed', (data: { payment: any }) => {
      console.log('Pago confirmado:', data);
      // Aquí se puede mostrar una notificación al cliente
    });

    // Cleanup al desmontar
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, accessToken, user]);

  return socketRef.current;
}

