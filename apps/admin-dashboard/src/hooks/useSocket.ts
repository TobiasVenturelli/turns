/**
 * @file useSocket.ts
 * @description Hook para conectar con el servidor de WebSockets
 * @author Turns Team
 * @created 2025-11-14
 */

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/auth-store';
import { useToast } from '@/hooks/use-toast';
import { API_CONFIG } from '@/config/api';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { token, isAuthenticated, user } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    // Solo conectar si está autenticado y es profesional
    if (!isAuthenticated || !token || user?.role !== 'PROFESSIONAL') {
      return;
    }

    // Conectar al servidor de WebSockets
    const socket = io(API_CONFIG.WS_URL, {
      auth: {
        token,
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

    // Eventos de turnos
    socket.on('appointment:created', (data: { appointment: any }) => {
      console.log('Nuevo turno creado:', data);
      toast({
        title: 'Nuevo turno reservado',
        description: `Un cliente ha reservado un turno para ${new Date(
          data.appointment.startTime,
        ).toLocaleDateString('es-AR')}`,
      });
    });

    socket.on('appointment:updated', (data: { appointment: any }) => {
      console.log('Turno actualizado:', data);
      toast({
        title: 'Turno actualizado',
        description: 'Un turno ha sido modificado',
      });
    });

    socket.on('appointment:cancelled', (data: { appointment: any }) => {
      console.log('Turno cancelado:', data);
      toast({
        title: 'Turno cancelado',
        description: 'Un turno ha sido cancelado',
        variant: 'destructive',
      });
    });

    // Eventos de pagos
    socket.on('payment:confirmed', (data: { payment: any }) => {
      console.log('Pago confirmado:', data);
      toast({
        title: 'Pago recibido',
        description: `Se recibió un pago de $${data.payment.amount?.toLocaleString('es-AR') || 'N/A'}`,
      });
    });

    socket.on('payment:refunded', (data: { payment: any }) => {
      console.log('Pago reembolsado:', data);
      toast({
        title: 'Reembolso procesado',
        description: 'Se procesó un reembolso',
        variant: 'destructive',
      });
    });

    // Cleanup al desmontar
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, token, user, toast]);

  return socketRef.current;
}

