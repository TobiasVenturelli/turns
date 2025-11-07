/**
 * @file ConfirmationStep.tsx
 * @description Paso 4 - Confirmación y resumen
 * @author Turns Team
 * @created 2025-11-07
 */

'use client';

import { Calendar, Clock, DollarSign, MapPin, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { BusinessWithRelations, Service } from '@/types';

interface ConfirmationStepProps {
  business: BusinessWithRelations;
  service: Service;
  date: Date;
  time: string;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export function ConfirmationStep({
  business,
  service,
  date,
  time,
  notes,
  onNotesChange,
}: ConfirmationStepProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="space-y-4">
        <h3 className="font-semibold">Resumen de tu reserva</h3>

        {/* Negocio */}
        <div className="flex items-start gap-3">
          <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">{business.name}</p>
            <p className="text-sm text-muted-foreground">
              {business.address}, {business.city}
            </p>
          </div>
        </div>

        <Separator />

        {/* Servicio */}
        <div className="flex items-start gap-3">
          <FileText className="mt-1 h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="font-medium">{service.name}</p>
            <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{service.duration} min</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>${service.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Fecha y Hora */}
        <div className="flex items-start gap-3">
          <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium capitalize">{formatDate(date)}</p>
            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{time} hs</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex items-center justify-between rounded-lg bg-muted p-4">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-2xl font-bold text-primary">
            ${service.price.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Notas opcionales */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notas adicionales (opcional)</Label>
        <Textarea
          id="notes"
          placeholder="Ej: Preferencias, alergias, solicitudes especiales..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={4}
        />
      </div>

      {/* Info adicional */}
      <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
        <p className="mb-2 font-medium text-foreground">Importante:</p>
        <ul className="list-inside list-disc space-y-1">
          <li>Recibirás un email de confirmación</li>
          <li>Por favor, llega 5 minutos antes</li>
          <li>Puedes cancelar hasta 24hs antes</li>
        </ul>
      </div>
    </div>
  );
}

