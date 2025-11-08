/**
 * @file turnos/page.tsx
 * @description Página de calendario de turnos con FullCalendar
 */

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { appointmentsService } from '@/services/appointments.service';
import { AppointmentDetailsDialog } from '@/components/appointments/appointment-details-dialog';
import { CreateAppointmentDialog } from '@/components/appointments/create-appointment-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import type { Appointment } from '@/types';

export default function TurnosPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Obtener todos los turnos
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentsService.getAll(),
  });

  // Convertir turnos a eventos de FullCalendar
  const events = appointments.map((appointment) => ({
    id: appointment.id,
    title: `${appointment.customer?.firstName || 'Cliente'} - ${appointment.service?.name || 'Servicio'}`,
    start: appointment.startTime,
    end: appointment.endTime,
    backgroundColor: getStatusColor(appointment.status),
    borderColor: getStatusColor(appointment.status),
    extendedProps: {
      appointment,
    },
  }));

  // Manejar click en evento
  const handleEventClick = (info: any) => {
    const appointment = info.event.extendedProps.appointment;
    setSelectedAppointment(appointment);
    setIsDetailsOpen(true);
  };

  // Manejar click en fecha (crear turno)
  const handleDateClick = (info: any) => {
    setSelectedDate(info.date);
    setIsCreateOpen(true);
  };

  // Manejar selección de rango de fechas
  const handleDateSelect = (info: any) => {
    setSelectedDate(info.start);
    setIsCreateOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Cargando calendario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Calendario de Turnos</h1>
          <p className="text-muted-foreground">
            Gestiona todos tus turnos desde aquí
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Turno
        </Button>
      </div>

      {/* Leyenda de colores */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span className="text-sm">Pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500"></div>
            <span className="text-sm">Confirmado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-sm">Completado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span className="text-sm">Cancelado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-500"></div>
            <span className="text-sm">No asistió</span>
          </div>
        </div>
      </Card>

      {/* Calendario */}
      <Card className="p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={esLocale}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          buttonText={{
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
          }}
          events={events}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          select={handleDateSelect}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          slotMinTime="08:00:00"
          slotMaxTime="22:00:00"
          slotDuration="00:30:00"
          allDaySlot={false}
          height="auto"
          expandRows={true}
          nowIndicator={true}
          eventDisplay="block"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
          }}
        />
      </Card>

      {/* Dialogs */}
      {selectedAppointment && (
        <AppointmentDetailsDialog
          appointment={selectedAppointment}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            setIsDetailsOpen(false);
          }}
        />
      )}

      <CreateAppointmentDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        selectedDate={selectedDate}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['appointments'] });
          setIsCreateOpen(false);
          toast({
            title: 'Turno creado',
            description: 'El turno se ha creado correctamente',
          });
        }}
      />
    </div>
  );
}

// Función auxiliar para obtener color por estado
function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: '#3b82f6', // blue-500
    CONFIRMED: '#eab308', // yellow-500
    COMPLETED: '#22c55e', // green-500
    CANCELLED: '#ef4444', // red-500
    NO_SHOW: '#6b7280', // gray-500
  };
  return colors[status] || '#3b82f6';
}

