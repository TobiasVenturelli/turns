/**
 * @file create-appointment-dialog.tsx
 * @description Dialog para crear un nuevo turno manualmente
 */

'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { appointmentsService } from '@/services/appointments.service';
import { servicesService } from '@/services/services.service';
import { customersService } from '@/services/customers.service';
import { businessService } from '@/services/business.service';

const appointmentSchema = z.object({
  customerId: z.string().min(1, 'Selecciona un cliente'),
  serviceId: z.string().min(1, 'Selecciona un servicio'),
  date: z.date({ message: 'Selecciona una fecha' }),
  time: z.string().min(1, 'Selecciona una hora'),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date | null;
  onSuccess: () => void;
}

export function CreateAppointmentDialog({
  open,
  onOpenChange,
  selectedDate,
  onSuccess,
}: CreateAppointmentDialogProps) {
  const { toast } = useToast();

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      customerId: '',
      serviceId: '',
      date: selectedDate || new Date(),
      time: '',
      notes: '',
    },
  });

  // Actualizar fecha cuando cambia selectedDate
  useEffect(() => {
    if (selectedDate) {
      form.setValue('date', selectedDate);
    }
  }, [selectedDate, form]);

  // Obtener negocio del profesional
  const { data: business } = useQuery({
    queryKey: ['my-business'],
    queryFn: () => businessService.getMyBusiness(),
  });

  // Obtener servicios
  const { data: services = [] } = useQuery({
    queryKey: ['services', business?.id],
    queryFn: () => servicesService.getAll(business?.id || ''),
    enabled: !!business?.id,
  });

  // Obtener clientes
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customersService.getAll(),
  });

  // Mutación para crear turno
  const createMutation = useMutation({
    mutationFn: (data: any) => appointmentsService.create(data),
    onSuccess: () => {
      toast({
        title: 'Turno creado',
        description: 'El turno se ha creado exitosamente',
      });
      form.reset();
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo crear el turno',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: AppointmentFormData) => {
    // Combinar fecha y hora
    const [hours, minutes] = data.time.split(':');
    const startTime = new Date(data.date);
    startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Calcular endTime basado en duración del servicio
    const service = services.find((s) => s.id === data.serviceId);
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + (service?.duration || 60));

    createMutation.mutate({
      customerId: data.customerId,
      serviceId: data.serviceId,
      businessId: business?.id,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      notes: data.notes,
    });
  };

  // Generar opciones de horarios (cada 30 minutos)
  const timeSlots = [];
  for (let hour = 8; hour < 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(timeString);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Turno</DialogTitle>
          <DialogDescription>
            Crea un turno manualmente para un cliente
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Cliente */}
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.firstName} {customer.lastName}
                          {customer.email && ` (${customer.email})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Servicio */}
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Servicio</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un servicio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - ${service.price} ({service.duration} min)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fecha */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha</FormLabel>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hora */}
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una hora" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-60">
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notas */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Información adicional..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creando...' : 'Crear Turno'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

