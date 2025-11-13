'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { AppointmentWithRelations } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AppointmentCardProps {
  appointment: AppointmentWithRelations;
  onCancel?: (appointment: AppointmentWithRelations) => void;
  onReschedule?: (appointment: AppointmentWithRelations) => void;
  onViewDetails?: (appointment: AppointmentWithRelations) => void;
}

export function AppointmentCard({
  appointment,
  onCancel,
  onReschedule,
  onViewDetails,
}: AppointmentCardProps) {
  const startDate = new Date(appointment.startTime);
  const isPast = startDate < new Date();
  const canCancel = !isPast && appointment.status !== 'cancelled';
  const canReschedule = !isPast && appointment.status !== 'cancelled';

  const getStatusBadge = () => {
    switch (appointment.status) {
      case 'confirmed':
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="mr-1 h-3 w-3" />
            Confirmado
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Cancelado
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary">
            <AlertCircle className="mr-1 h-3 w-3" />
            Pendiente
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-blue-50">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completado
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPaymentBadge = () => {
    if (appointment.isPaid) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700">
          <DollarSign className="mr-1 h-3 w-3" />
          Pagado
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
        <DollarSign className="mr-1 h-3 w-3" />
        Pendiente de pago
      </Badge>
    );
  };

  return (
    <Card className={isPast ? 'opacity-75' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold">{appointment.service.name}</h3>
            <p className="text-sm text-muted-foreground">
              {appointment.business.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            {!isPast && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onViewDetails && (
                    <DropdownMenuItem onClick={() => onViewDetails(appointment)}>
                      Ver detalles
                    </DropdownMenuItem>
                  )}
                  {canReschedule && onReschedule && (
                    <DropdownMenuItem onClick={() => onReschedule(appointment)}>
                      Reprogramar
                    </DropdownMenuItem>
                  )}
                  {canCancel && onCancel && (
                    <DropdownMenuItem
                      onClick={() => onCancel(appointment)}
                      className="text-destructive"
                    >
                      Cancelar turno
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>
            {format(startDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{format(startDate, 'HH:mm', { locale: es })} hs</span>
          <span className="text-muted-foreground">
            ({appointment.service.duration} min)
          </span>
        </div>
        {appointment.business.address && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {appointment.business.address}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">${appointment.service.price}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-3">
        <div className="flex w-full items-center justify-between">
          {getPaymentBadge()}
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(appointment)}
            >
              Ver detalles
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

