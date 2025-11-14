/**
 * @file dashboard/page.tsx
 * @description Página principal del dashboard
 */

'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { StatsCard } from '@/components/dashboard/stats-card';
import { BookingLinkCard } from '@/components/dashboard/booking-link-card';
import { TrialBanner } from '@/components/dashboard/trial-banner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { appointmentsService } from '@/services/appointments.service';
import { businessService } from '@/services/business.service';
import { formatCurrency } from '@/lib/utils';
import { useSocket } from '@/hooks/useSocket';
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const socket = useSocket();

  // Obtener estadísticas
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => appointmentsService.getStats(),
  });

  // Obtener información del negocio
  const { data: business } = useQuery({
    queryKey: ['my-business'],
    queryFn: () => businessService.getMyBusiness(),
  });

  // Escuchar eventos de WebSocket para refrescar estadísticas
  useEffect(() => {
    if (!socket) return;

    const handleAppointmentEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    };

    const handlePaymentEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    };

    socket.on('appointment:created', handleAppointmentEvent);
    socket.on('appointment:updated', handleAppointmentEvent);
    socket.on('appointment:cancelled', handleAppointmentEvent);
    socket.on('payment:confirmed', handlePaymentEvent);

    return () => {
      socket.off('appointment:created', handleAppointmentEvent);
      socket.off('appointment:updated', handleAppointmentEvent);
      socket.off('appointment:cancelled', handleAppointmentEvent);
      socket.off('payment:confirmed', handlePaymentEvent);
    };
  }, [socket, queryClient]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen de tu negocio y actividad reciente
        </p>
      </div>

      {/* Banner de Trial/Suscripción */}
      {business?.subscription && (
        <TrialBanner subscription={business.subscription} />
      )}

      {/* Link de Reserva */}
      {business?.slug && (
        <BookingLinkCard businessSlug={business.slug} />
      )}

      {/* Estadísticas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Turnos de Hoy"
          value={stats?.todayAppointments || 0}
          description="Citas programadas para hoy"
          icon={Calendar}
        />

        <StatsCard
          title="Ingresos de Hoy"
          value={formatCurrency(stats?.todayRevenue || 0)}
          description="Total del día actual"
          icon={DollarSign}
        />

        <StatsCard
          title="Ingresos del Mes"
          value={formatCurrency(stats?.monthRevenue || 0)}
          description="Ingresos acumulados"
          icon={TrendingUp}
        />

        <StatsCard
          title="Total Clientes"
          value={stats?.totalCustomers || 0}
          description="Clientes registrados"
          icon={Users}
        />
      </div>

      {/* Segunda fila de estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Turnos Pendientes"
          value={stats?.pendingAppointments || 0}
          description="Por confirmar"
          icon={Clock}
        />

        <StatsCard
          title="Turnos Completados"
          value={stats?.completedAppointments || 0}
          description="Este mes"
          icon={CheckCircle}
        />

        <StatsCard
          title="Cancelaciones"
          value={stats?.cancelledAppointments || 0}
          description="Este mes"
          icon={XCircle}
        />
      </div>

      {/* Próximos turnos */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Turnos</CardTitle>
          <CardDescription>Citas programadas para hoy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Cargando turnos próximos...
            </p>
            {/* TODO: Implementar lista de turnos próximos */}
          </div>
        </CardContent>
      </Card>

      {/* Actividad reciente */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Últimas acciones en tu negocio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              No hay actividad reciente para mostrar
            </p>
            {/* TODO: Implementar lista de actividad reciente */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

