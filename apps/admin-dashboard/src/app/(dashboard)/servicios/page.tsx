/**
 * @file servicios/page.tsx
 * @description Página de gestión de servicios
 */

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { servicesService } from '@/services/services.service';
import { businessService } from '@/services/business.service';
import { CreateServiceDialog } from '@/components/services/create-service-dialog';
import { EditServiceDialog } from '@/components/services/edit-service-dialog';
import { Plus, Edit, Trash2, Clock, DollarSign, Power, PowerOff } from 'lucide-react';
import type { Service } from '@/types';

export default function ServiciosPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Obtener negocio del profesional
  const { data: business } = useQuery({
    queryKey: ['my-business'],
    queryFn: () => businessService.getMyBusiness(),
  });

  // Obtener servicios
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services', business?.id],
    queryFn: () => servicesService.getAll(business?.id || ''),
    enabled: !!business?.id,
  });

  // Mutación para eliminar servicio
  const deleteMutation = useMutation({
    mutationFn: (serviceId: string) => servicesService.delete(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: 'Servicio eliminado',
        description: 'El servicio se ha eliminado correctamente',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el servicio',
        variant: 'destructive',
      });
    },
  });

  // Mutación para activar/desactivar servicio
  const toggleActiveMutation = useMutation({
    mutationFn: ({ serviceId, isActive }: { serviceId: string; isActive: boolean }) =>
      servicesService.toggleActive(serviceId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: 'Estado actualizado',
        description: 'El estado del servicio se ha actualizado',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (serviceId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      deleteMutation.mutate(serviceId);
    }
  };

  const handleToggleActive = (serviceId: string, currentIsActive: boolean) => {
    toggleActiveMutation.mutate({ serviceId, isActive: !currentIsActive });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Servicios</h1>
          <p className="text-muted-foreground">
            Gestiona los servicios que ofreces a tus clientes
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Servicio
        </Button>
      </div>

      {/* Lista de servicios */}
      {services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No hay servicios</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Comienza agregando tu primer servicio
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Servicio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    {service.description && (
                      <CardDescription className="mt-2">
                        {service.description}
                      </CardDescription>
                    )}
                  </div>
                  <Badge variant={service.isActive ? 'default' : 'secondary'}>
                    {service.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Precio y duración */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium text-foreground">${service.price}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration} min</span>
                  </div>
                </div>

                {/* Categoría */}
                {service.category && (
                  <div>
                    <Badge variant="outline">{service.category}</Badge>
                  </div>
                )}

                {/* Imagen */}
                {service.imageUrl && (
                  <div className="relative h-32 w-full rounded-md overflow-hidden">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}

                {/* Acciones */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setEditingService(service)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(service.id, service.isActive)}
                  >
                    {service.isActive ? (
                      <PowerOff className="h-4 w-4" />
                    ) : (
                      <Power className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreateServiceDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        businessId={business?.id || ''}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['services'] });
          setIsCreateOpen(false);
        }}
      />

      {editingService && (
        <EditServiceDialog
          service={editingService}
          open={!!editingService}
          onOpenChange={(open) => !open && setEditingService(null)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            setEditingService(null);
          }}
        />
      )}
    </div>
  );
}

