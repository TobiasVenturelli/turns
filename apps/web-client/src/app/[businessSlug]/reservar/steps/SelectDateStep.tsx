/**
 * @file SelectDateStep.tsx
 * @description Paso 2 - Seleccionar fecha
 * @author Turns Team
 * @created 2025-11-07
 */

'use client';

import { Calendar } from '@/components/ui/calendar';
import type { Schedule } from '@/types';

interface SelectDateStepProps {
  schedules: Schedule[];
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
}

export function SelectDateStep({
  schedules,
  selectedDate,
  onSelectDate,
}: SelectDateStepProps) {
  // Obtener días laborables del negocio
  const workingDays = schedules
    .filter((s) => s.isActive)
    .map((s) => s.dayOfWeek);

  // Función para deshabilitar días que el negocio no trabaja
  const disabledDays = (date: Date) => {
    const dayOfWeek = date.getDay();
    return !workingDays.includes(dayOfWeek);
  };

  // Deshabilitar fechas pasadas
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="flex justify-center">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        disabled={(date) => date < today || disabledDays(date)}
        className="rounded-md border"
      />
    </div>
  );
}

