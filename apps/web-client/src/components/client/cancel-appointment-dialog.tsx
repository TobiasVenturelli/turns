'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';
import type { AppointmentWithRelations } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CancelAppointmentDialogProps {
  appointment: AppointmentWithRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (appointmentId: string, reason?: string) => Promise<void>;
}

export function CancelAppointmentDialog({
  appointment,
  open,
  onOpenChange,
  onConfirm,
}: CancelAppointmentDialogProps) {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!appointment) return;

    try {
      setIsLoading(true);
      await onConfirm(appointment.id, reason || undefined);
      setReason('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Cancelar Turno
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas cancelar este turno? Esta acción no se
            puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <div>
              <p className="text-sm font-medium">{appointment.service.name}</p>
              <p className="text-sm text-muted-foreground">
                {appointment.business.name}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span>
                {format(
                  new Date(appointment.startTime),
                  "d 'de' MMMM, yyyy",
                  { locale: es }
                )}
              </span>
              <span>
                {format(new Date(appointment.startTime), 'HH:mm', {
                  locale: es,
                })}{' '}
                hs
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">
              Motivo de cancelación (opcional)
            </Label>
            <Textarea
              id="reason"
              placeholder="Ej: Surgió un imprevisto..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              disabled={isLoading}
            />
          </div>

          {appointment.isPaid && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> Este turno está pagado. Si cancelas,
                deberás contactar al negocio para gestionar el reembolso.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Volver
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                Cancelando...
              </>
            ) : (
              'Confirmar Cancelación'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

