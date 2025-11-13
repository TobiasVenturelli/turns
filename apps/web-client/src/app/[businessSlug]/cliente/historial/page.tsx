'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { appointmentService } from '@/services/appointment.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, DollarSign, Search, Loader2, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { AppointmentWithRelations } from '@/types';

export default function HistorialPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: () => appointmentService.getMyAppointments(),
  });

  // Filter appointments by search query
  const filteredAppointments = appointments.filter((appointment) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      appointment.service.name.toLowerCase().includes(searchLower) ||
      appointment.business.name.toLowerCase().includes(searchLower) ||
      appointment.status.toLowerCase().includes(searchLower)
    );
  });

  // Sort by date (most recent first)
  const sortedAppointments = [...filteredAppointments].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  // Calculate statistics
  const stats = {
    total: appointments.length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
    totalSpent: appointments
      .filter((a) => a.isPaid)
      .reduce((sum, a) => sum + a.service.price, 0),
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmado</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-50">Completado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Historial de Turnos</h1>
        <p className="text-muted-foreground">
          Consulta todos tus turnos y estadísticas
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Turnos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Cancelados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Gastado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalSpent}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por servicio, negocio o estado..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Appointments List */}
      {sortedAppointments.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No hay resultados</CardTitle>
            <CardDescription>
              {searchQuery
                ? 'No se encontraron turnos que coincidan con tu búsqueda.'
                : 'No tienes ningún turno en tu historial.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <FileText className="mb-4 h-16 w-16 text-muted-foreground" />
              <p className="text-center text-sm text-muted-foreground">
                {searchQuery
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Tus turnos aparecerán aquí una vez que los reserves'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedAppointments.map((appointment: AppointmentWithRelations) => {
            const startDate = new Date(appointment.startTime);
            return (
              <Card key={appointment.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{appointment.service.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {appointment.business.name}
                          </p>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {format(startDate, "d 'de' MMMM, yyyy", { locale: es })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{format(startDate, 'HH:mm', { locale: es })} hs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">${appointment.service.price}</span>
                          {appointment.isPaid && (
                            <Badge
                              variant="outline"
                              className="ml-1 bg-green-50 text-green-700"
                            >
                              Pagado
                            </Badge>
                          )}
                        </div>
                      </div>

                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Notas:</strong> {appointment.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

