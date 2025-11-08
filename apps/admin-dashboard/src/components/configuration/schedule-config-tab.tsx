/**
 * @file schedule-config-tab.tsx
 * @description Tab de configuración de horarios
 */

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { businessService } from '@/services/business.service';
import { Clock, Save, Plus, X } from 'lucide-react';

const DAYS_OF_WEEK = [
  { value: 'MONDAY', label: 'Lunes' },
  { value: 'TUESDAY', label: 'Martes' },
  { value: 'WEDNESDAY', label: 'Miércoles' },
  { value: 'THURSDAY', label: 'Jueves' },
  { value: 'FRIDAY', label: 'Viernes' },
  { value: 'SATURDAY', label: 'Sábado' },
  { value: 'SUNDAY', label: 'Domingo' },
];

interface WorkingHour {
  day: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export function ScheduleConfigTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Obtener negocio del profesional
  const { data: business, isLoading } = useQuery({
    queryKey: ['my-business'],
    queryFn: () => businessService.getMyBusiness(),
  });

  // Estado local para horarios de trabajo
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>(
    DAYS_OF_WEEK.map((day) => ({
      day: day.value,
      startTime: '09:00',
      endTime: '18:00',
      isActive: day.value !== 'SUNDAY',
    }))
  );

  const [slotDuration, setSlotDuration] = useState('30');
  const [breakTime, setBreakTime] = useState('0');

  // Mutación para actualizar configuración
  const updateMutation = useMutation({
    mutationFn: (data: any) => businessService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-business'] });
      toast({
        title: 'Horarios guardados',
        description: 'La configuración de horarios se ha actualizado',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la configuración',
        variant: 'destructive',
      });
    },
  });

  const handleToggleDay = (day: string) => {
    setWorkingHours((prev) =>
      prev.map((h) => (h.day === day ? { ...h, isActive: !h.isActive } : h))
    );
  };

  const handleTimeChange = (day: string, field: 'startTime' | 'endTime', value: string) => {
    setWorkingHours((prev) =>
      prev.map((h) => (h.day === day ? { ...h, [field]: value } : h))
    );
  };

  const handleSave = () => {
    updateMutation.mutate({
      workingHours,
      slotDuration: parseInt(slotDuration),
      breakTime: parseInt(breakTime),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Horarios por día */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horarios de Atención
          </CardTitle>
          <CardDescription>
            Configura tus días y horarios laborables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {workingHours.map((wh, index) => {
            const dayLabel = DAYS_OF_WEEK.find((d) => d.value === wh.day)?.label;
            return (
              <div
                key={wh.day}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div className="w-32">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{dayLabel}</span>
                    {wh.isActive && (
                      <Badge variant="outline" className="text-xs">
                        Activo
                      </Badge>
                    )}
                  </div>
                </div>

                {wh.isActive ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      type="time"
                      value={wh.startTime}
                      onChange={(e) =>
                        handleTimeChange(wh.day, 'startTime', e.target.value)
                      }
                      className="w-32"
                    />
                    <span className="text-muted-foreground">a</span>
                    <Input
                      type="time"
                      value={wh.endTime}
                      onChange={(e) =>
                        handleTimeChange(wh.day, 'endTime', e.target.value)
                      }
                      className="w-32"
                    />
                  </div>
                ) : (
                  <div className="flex-1 text-muted-foreground text-sm">
                    No laborable
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleDay(wh.day)}
                >
                  {wh.isActive ? (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Desactivar
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1" />
                      Activar
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Configuración de slots */}
      <Card>
        <CardHeader>
          <CardTitle>Duración de Turnos</CardTitle>
          <CardDescription>
            Configura la duración predeterminada de los turnos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="slotDuration">Duración del turno (minutos)</Label>
              <Input
                id="slotDuration"
                type="number"
                value={slotDuration}
                onChange={(e) => setSlotDuration(e.target.value)}
                min="5"
                step="5"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Duración predeterminada de cada turno
              </p>
            </div>

            <div>
              <Label htmlFor="breakTime">Tiempo de descanso (minutos)</Label>
              <Input
                id="breakTime"
                type="number"
                value={breakTime}
                onChange={(e) => setBreakTime(e.target.value)}
                min="0"
                step="5"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Tiempo entre turnos para preparar
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón de guardar */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updateMutation.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {updateMutation.isPending ? 'Guardando...' : 'Guardar Configuración'}
        </Button>
      </div>
    </div>
  );
}

