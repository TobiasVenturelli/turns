/**
 * @file business-config-tab.tsx
 * @description Tab de configuración del negocio
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { businessService } from '@/services/business.service';
import { QrCode, Share2, Copy, MapPin, Globe, Building2, Save } from 'lucide-react';

const businessSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
});

type BusinessFormData = z.infer<typeof businessSchema>;

export function BusinessConfigTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Obtener negocio del profesional
  const { data: business, isLoading } = useQuery({
    queryKey: ['my-business'],
    queryFn: () => businessService.getMyBusiness(),
  });

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    values: {
      name: business?.name || '',
      description: business?.description || '',
      phone: business?.phone || '',
      email: business?.email || '',
      address: business?.address || '',
      city: business?.city || '',
      country: business?.country || '',
      website: business?.website || '',
    },
  });

  // Mutación para actualizar negocio
  const updateMutation = useMutation({
    mutationFn: (data: any) => businessService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-business'] });
      toast({
        title: 'Cambios guardados',
        description: 'La información del negocio se ha actualizado',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la información',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: BusinessFormData) => {
    updateMutation.mutate(data);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/negocio/${business?.slug || business?.id}`;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Link copiado',
      description: 'El link se ha copiado al portapapeles',
    });
  };

  const handleShareLink = async () => {
    const link = `${window.location.origin}/negocio/${business?.slug || business?.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: business?.name,
          text: `Reserva tu turno en ${business?.name}`,
          url: link,
        });
      } catch (error) {
        // Usuario canceló
      }
    } else {
      handleCopyLink();
    }
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
      {/* Información del negocio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Información del Negocio
          </CardTitle>
          <CardDescription>
            Actualiza la información básica de tu negocio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del negocio</FormLabel>
                    <FormControl>
                      <Input placeholder="Mi Negocio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Descripción breve de tu negocio"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="+54 9 11 1234-5678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="contacto@negocio.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input placeholder="Calle 123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <FormControl>
                        <Input placeholder="Buenos Aires" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>País</FormLabel>
                      <FormControl>
                        <Input placeholder="Argentina" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sitio web (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://minegocio.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={updateMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Link compartible y QR */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Link Compartible
          </CardTitle>
          <CardDescription>
            Comparte el link de tu negocio para que los clientes reserven turnos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={`${typeof window !== 'undefined' ? window.location.origin : ''}/negocio/${business?.slug || business?.id}`}
              className="flex-1"
            />
            <Button variant="outline" onClick={handleCopyLink}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleShareLink}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Código QR</h4>
              <p className="text-sm text-muted-foreground">
                Descarga el QR para imprimirlo en tu local
              </p>
            </div>
            <Button variant="outline">
              <QrCode className="h-4 w-4 mr-2" />
              Generar QR
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

