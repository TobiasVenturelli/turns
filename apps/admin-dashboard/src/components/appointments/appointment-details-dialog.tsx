/**
 * @file appointment-details-dialog.tsx
 * @description Dialog para ver y gestionar detalles de un turno
 */

'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { appointmentsService } from '@/services/appointments.service';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  DollarSign,
  CheckCircle,
  XCircle,
  UserX,
  Edit,
} from 'lucide-react';
import type { Appointment } from '@/types';

interface AppointmentDetailsDialogProps {
  appointment: Appointment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AppointmentDetailsDialog({
  appointment,
  open,
  onOpenChange,
  onSuccess,
}: AppointmentDetailsDialogProps) {
  const { toast } = useToast();
  const [isConfirming, setIsConfirming] = useState(false);

  // Mutación para completar turno
  const completeMutation = useMutation({
    mutationFn: () => appointmentsService.complete(appointment.id),
    onSuccess: () => {
      toast({
        title: 'Turno completado',
        description: 'El turno se ha marcado como completado',
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudo completar el turno',
        variant: 'destructive',
      });
    },
  });

  // Mutación para cancelar turno
  const cancelMutation = useMutation({
    mutationFn: () => appointmentsService.cancel(appointment.id),
    onSuccess: () => {
      toast({
        title: 'Turno cancelado',
        description: 'El turno se ha cancelado correctamente',
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudo cancelar el turno',
        variant: 'destructive',
      });
    },
  });

  // Mutación para marcar como no presentado
  const noShowMutation = useMutation({
    mutationFn: () => appointmentsService.markAsNoShow(appointment.id),
    onSuccess: () => {
      toast({
        title: 'Turno marcado',
        description: 'El turno se ha marcado como no presentado',
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el turno',
        variant: 'destructive',
      });
    },
  });

  const handleComplete = () => {
    completeMutation.mutate();
  };

  const handleCancel = () => {
    if (isConfirming) {
      cancelMutation.mutate();
      setIsConfirming(false);
    } else {
      setIsConfirming(true);
    }
  };

  const handleNoShow = () => {
    noShowMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalles del Turno</DialogTitle>
          <DialogDescription>
            Información completa y acciones disponibles
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estado */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estado:</span>
            <Badge variant={getStatusVariant(appointment.status)}>
              {getStatusLabel(appointment.status)}
            </Badge>
          </div>

          <Separator />

          {/* Cliente */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Cliente
            </h3>
            <div className="space-y-2 pl-6">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{appointment.customer?.firstName} {appointment.customer?.lastName}</span>
              </div>
              {appointment.customer?.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{appointment.customer.email}</span>
                </div>
              )}
              {appointment.customer?.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{appointment.customer.phone}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Servicio */}
          <div className="space-y-3">
            <h3 className="font-semibold">Servicio</h3>
            <div className="space-y-2 pl-6">
              <div className="text-sm">
                <span className="font-medium">{appointment.service?.name}</span>
              </div>
              {appointment.service?.description && (
                <p className="text-sm text-muted-foreground">
                  {appointment.service.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{appointment.service?.duration} minutos</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                <span>${appointment.service?.price}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Fecha y hora */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fecha y Hora
            </h3>
            <div className="space-y-2 pl-6">
              <div className="text-sm">
                <span className="font-medium">
                  {format(new Date(appointment.startTime), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>
                  {format(new Date(appointment.startTime), 'HH:mm')} -{' '}
                  {format(new Date(appointment.endTime), 'HH:mm')}
                </span>
              </div>
            </div>
          </div>

          {/* Notas */}
          {appointment.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold">Notas</h3>
                <p className="text-sm text-muted-foreground pl-6">
                  {appointment.notes}
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {appointment.status === 'PENDING' || appointment.status === 'CONFIRMED' ? (
            <>
              <Button
                variant="default"
                onClick={handleComplete}
                disabled={completeMutation.isPending}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Completar
              </Button>
              <Button
                variant="secondary"
                onClick={handleNoShow}
                disabled={noShowMutation.isPending}
              >
                <UserX className="h-4 w-4 mr-2" />
                No asistió
              </Button>
              <Button
                variant={isConfirming ? 'destructive' : 'outline'}
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
              >
                <XCircle className="h-4 w-4 mr-2" />
                {isConfirming ? 'Confirmar cancelación' : 'Cancelar turno'}
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
          )}
        </DialogFooter>
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

