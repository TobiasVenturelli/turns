/**
 * @file customer-details-dialog.tsx
 * @description Dialog para ver detalles de un cliente
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { appointmentsService } from '@/services/appointments.service';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
} from 'lucide-react';
import type { User as Customer } from '@/types';

interface CustomerDetailsDialogProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerDetailsDialog({
  customer,
  open,
  onOpenChange,
}: CustomerDetailsDialogProps) {
  // Obtener turnos del cliente
  const { data: allAppointments = [] } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentsService.getAll(),
  });

  // Filtrar turnos del cliente
  const customerAppointments = allAppointments.filter(
    (apt) => apt.customerId === customer.id
  );

  // Calcular estadísticas
  const totalAppointments = customerAppointments.length;
  const completedAppointments = customerAppointments.filter(
    (apt) => apt.status === 'COMPLETED'
  ).length;
  const cancelledAppointments = customerAppointments.filter(
    (apt) => apt.status === 'CANCELLED'
  ).length;
  const totalSpent = customerAppointments
    .filter((apt) => apt.status === 'COMPLETED')
    .reduce((sum, apt) => sum + (apt.service?.price || 0), 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles del Cliente</DialogTitle>
          <DialogDescription>
            Información completa e historial de turnos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre completo</p>
                  <p className="font-medium">
                    {customer.firstName} {customer.lastName}
                  </p>
                </div>
                {customer.email && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{customer.email}</p>
                    </div>
                  </div>
                )}
                {customer.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{customer.phone}</p>
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Cliente desde</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">
                      {format(new Date(customer.createdAt), "d 'de' MMMM 'de' yyyy", {
                        locale: es,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Calendar className="h-8 w-8 text-primary mb-2" />
                  <p className="text-2xl font-bold">{totalAppointments}</p>
                  <p className="text-sm text-muted-foreground">Total turnos</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                  <p className="text-2xl font-bold">{completedAppointments}</p>
                  <p className="text-sm text-muted-foreground">Completados</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <XCircle className="h-8 w-8 text-red-500 mb-2" />
                  <p className="text-2xl font-bold">{cancelledAppointments}</p>
                  <p className="text-sm text-muted-foreground">Cancelados</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <DollarSign className="h-8 w-8 text-blue-500 mb-2" />
                  <p className="text-2xl font-bold">${totalSpent}</p>
                  <p className="text-sm text-muted-foreground">Total gastado</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Historial de turnos */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Turnos</CardTitle>
              <CardDescription>
                Últimos turnos del cliente ({customerAppointments.length})
              </CardDescription>
            </CardHeader>
            <CardContent>
              {customerAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Este cliente aún no tiene turnos
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customerAppointments
                    .sort(
                      (a, b) =>
                        new Date(b.startTime).getTime() -
                        new Date(a.startTime).getTime()
                    )
                    .slice(0, 10)
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{appointment.service?.name}</p>
                            <Badge variant={getStatusVariant(appointment.status)}>
                              {getStatusLabel(appointment.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {format(new Date(appointment.startTime), "d 'de' MMMM", {
                                locale: es,
                              })}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {format(new Date(appointment.startTime), 'HH:mm')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${appointment.service?.price}</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmado',
    COMPLETED: 'Completado',
    CANCELLED: 'Cancelado',
    NO_SHOW: 'No asistió',
  };
  return labels[status] || status;
}

function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    PENDING: 'default',
    CONFIRMED: 'secondary',
    COMPLETED: 'outline',
    CANCELLED: 'destructive',
    NO_SHOW: 'secondary',
  };
  return variants[status] || 'default';
}

