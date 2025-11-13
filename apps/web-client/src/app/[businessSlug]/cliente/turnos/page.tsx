'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '@/services/appointment.service';
import { AppointmentCard } from '@/components/client/appointment-card';
import {
  AppointmentFilters,
  type AppointmentFilter,
} from '@/components/client/appointment-filters';
import { CancelAppointmentDialog } from '@/components/client/cancel-appointment-dialog';
import { AppointmentDetailsDialog } from '@/components/client/appointment-details-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { AppointmentWithRelations } from '@/types';

export default function MisTurnosPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const businessSlug = params.businessSlug as string;

  const [activeFilter, setActiveFilter] = useState<AppointmentFilter>('upcoming');
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentWithRelations | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Fetch appointments
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: () => appointmentService.getMyAppointments(),
  });

  // Cancel appointment mutation
  const cancelMutation = useMutation({
    mutationFn: ({ appointmentId, reason }: { appointmentId: string; reason?: string }) =>
      appointmentService.cancelAppointment(appointmentId, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] });
      toast({
        title: 'Turno cancelado',
        description: 'Tu turno ha sido cancelado exitosamente.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo cancelar el turno. Intenta nuevamente.',
        variant: 'destructive',
      });
    },
  });

  // Filter appointments
  const filteredAppointments = appointments.filter((appointment) => {
    const now = new Date();
    const appointmentDate = new Date(appointment.startTime);

    switch (activeFilter) {
      case 'upcoming':
        return appointmentDate >= now && appointment.status !== 'cancelled';
      case 'past':
        return appointmentDate < now && appointment.status !== 'cancelled';
      case 'cancelled':
        return appointment.status === 'cancelled';
      case 'all':
        return true;
      default:
        return true;
    }
  });

  // Calculate counts for filters
  const counts = {
    upcoming: appointments.filter(
      (a) => new Date(a.startTime) >= new Date() && a.status !== 'cancelled'
    ).length,
    past: appointments.filter(
      (a) => new Date(a.startTime) < new Date() && a.status !== 'cancelled'
    ).length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
    all: appointments.length,
  };

  const handleCancel = (appointment: AppointmentWithRelations) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  const handleViewDetails = (appointment: AppointmentWithRelations) => {
    setSelectedAppointment(appointment);
    setDetailsDialogOpen(true);
  };

  const handleReschedule = (_appointment: AppointmentWithRelations) => {
    // TODO: Implement reschedule flow (reuse reservation wizard)
    toast({
      title: 'Función en desarrollo',
      description: 'La reprogramación de turnos estará disponible próximamente.',
    });
  };

  const handleConfirmCancel = async (appointmentId: string, reason?: string) => {
    await cancelMutation.mutateAsync({ appointmentId, reason });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Cargando turnos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mis Turnos</h1>
          <p className="text-muted-foreground">
            Gestiona tus reservas y consulta tu historial
          </p>
        </div>
        <Button onClick={() => router.push(`/${businessSlug}/reservar`)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Turno
        </Button>
      </div>

      {/* Filters */}
      <AppointmentFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={counts}
      />

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No hay turnos</CardTitle>
            <CardDescription>
              {activeFilter === 'upcoming' &&
                'No tienes turnos próximos. ¡Reserva uno ahora!'}
              {activeFilter === 'past' && 'No tienes turnos pasados.'}
              {activeFilter === 'cancelled' && 'No tienes turnos cancelados.'}
              {activeFilter === 'all' && 'No tienes ningún turno registrado.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <Calendar className="mb-4 h-16 w-16 text-muted-foreground" />
              <p className="mb-4 text-center text-sm text-muted-foreground">
                Comienza reservando tu primer turno
              </p>
              <Button onClick={() => router.push(`/${businessSlug}/reservar`)}>
                <Plus className="mr-2 h-4 w-4" />
                Reservar Turno
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCancel={handleCancel}
              onReschedule={handleReschedule}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CancelAppointmentDialog
        appointment={selectedAppointment}
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleConfirmCancel}
      />

      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </div>
  );
}

