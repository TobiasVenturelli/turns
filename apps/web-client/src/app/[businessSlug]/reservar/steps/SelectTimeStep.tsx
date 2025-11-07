/**
 * @file SelectTimeStep.tsx
 * @description Paso 3 - Seleccionar horario
 * @author Turns Team
 * @created 2025-11-07
 */

'use client';

import { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { appointmentService, type AvailableSlot } from '@/services/appointment.service';
import { Clock } from 'lucide-react';

interface SelectTimeStepProps {
  businessId: string;
  serviceId: string;
  selectedDate: Date;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

export function SelectTimeStep({
  businessId,
  serviceId,
  selectedDate,
  selectedTime,
  onSelectTime,
}: SelectTimeStepProps) {
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSlots();
  }, [businessId, serviceId, selectedDate]);

  const loadSlots = async () => {
    try {
      setLoading(true);
      const dateString = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const data = await appointmentService.getAvailableSlots(
        businessId,
        serviceId,
        dateString,
      );
      setSlots(data);
    } catch (error) {
      console.error('Error loading slots:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="text-muted-foreground">Cargando horarios disponibles...</p>
      </div>
    );
  }

  const availableSlots = slots.filter((slot) => slot.available);

  if (availableSlots.length === 0) {
    return (
      <div className="py-8 text-center">
        <Clock className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-lg font-medium">No hay horarios disponibles</p>
        <p className="text-muted-foreground">
          Por favor, selecciona otra fecha
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {availableSlots.length} horarios disponibles
      </p>
      <RadioGroup value={selectedTime || ''} onValueChange={onSelectTime}>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {availableSlots.map((slot) => (
            <div key={slot.startTime}>
              <RadioGroupItem
                value={slot.startTime}
                id={slot.startTime}
                className="peer sr-only"
              />
              <Label
                htmlFor={slot.startTime}
                className="flex cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-background p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground [&:has([data-state=checked])]:border-primary"
              >
                <Clock className="mr-2 h-4 w-4" />
                {slot.startTime}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}

