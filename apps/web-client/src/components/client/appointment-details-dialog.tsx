'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import type { AppointmentWithRelations } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AppointmentDetailsDialogProps {
  appointment: AppointmentWithRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppointmentDetailsDialog({
  appointment,
  open,
  onOpenChange,
}: AppointmentDetailsDialogProps) {
  if (!appointment) return null;

  const startDate = new Date(appointment.startTime);
  const endDate = new Date(appointment.endTime);

  const getStatusInfo = () => {
    switch (appointment.status) {
      case 'confirmed':
        return {
          icon: CheckCircle,
          label: 'Confirmado',
          className: 'bg-green-500',
        };
      case 'cancelled':
        return {
          icon: XCircle,
          label: 'Cancelado',
          className: 'bg-destructive',
        };
      case 'pending':
        return {
          icon: AlertCircle,
          label: 'Pendiente',
          className: 'bg-secondary',
        };
      case 'completed':
        return {
          icon: CheckCircle,
          label: 'Completado',
          className: 'bg-blue-500',
        };
      default:
        return {
          icon: AlertCircle,
          label: appointment.status,
          className: 'bg-secondary',
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalles del Turno</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge variant="default" className={statusInfo.className}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {statusInfo.label}
            </Badge>
            {appointment.isPaid ? (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <DollarSign className="mr-1 h-3 w-3" />
                Pagado
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                <DollarSign className="mr-1 h-3 w-3" />
                Pendiente de pago
              </Badge>
            )}
          </div>

          <Separator />

          {/* Service Info */}
          <div className="space-y-3">
            <h3 className="font-semibold">Servicio</h3>
            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <p className="font-medium">{appointment.service.name}</p>
              {appointment.service.description && (
                <p className="text-sm text-muted-foreground">
                  {appointment.service.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {appointment.service.duration} min
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />$
                  {appointment.service.price}
                </span>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-3">
            <h3 className="font-semibold">Fecha y Hora</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(startDate, "EEEE, d 'de' MMMM 'de' yyyy", {
                    locale: es,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(startDate, 'HH:mm', { locale: es })} -{' '}
                  {format(endDate, 'HH:mm', { locale: es })} hs
                </span>
              </div>
            </div>
          </div>

          {/* Business Info */}
          <div className="space-y-3">
            <h3 className="font-semibold">Negocio</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.business.name}</span>
              </div>
              {appointment.business.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{appointment.business.phone}</span>
                </div>
              )}
              {appointment.business.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{appointment.business.email}</span>
                </div>
              )}
              {appointment.business.address && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{appointment.business.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div className="space-y-3">
              <h3 className="font-semibold">Notas</h3>
              <div className="flex items-start gap-2 text-sm">
                <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <p className="text-muted-foreground">{appointment.notes}</p>
              </div>
            </div>
          )}

          {/* Payment Method */}
          {appointment.paymentMethod && (
            <div className="space-y-3">
              <h3 className="font-semibold">Método de Pago</h3>
              <p className="text-sm capitalize">{appointment.paymentMethod}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

