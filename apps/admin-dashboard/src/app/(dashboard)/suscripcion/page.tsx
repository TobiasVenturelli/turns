'use client';

/**
 * @file page.tsx
 * @description Página de estado de suscripción actual
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  getCurrentSubscription,
  cancelSubscription,
  reactivateSubscription,
  createPaymentPreference,
  type Subscription,
} from '@/services/subscriptions.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle2, XCircle, Calendar, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

export default function SuscripcionPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query para obtener la suscripción actual
  const { data: subscription, isLoading, error } = useQuery<Subscription>({
    queryKey: ['subscription', 'current'],
    queryFn: getCurrentSubscription,
  });

  // Mutation para cancelar suscripción
  const cancelMutation = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      toast({
        title: 'Suscripción cancelada',
        description: 'Tu suscripción se cancelará al final del período actual.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo cancelar la suscripción',
        variant: 'destructive',
      });
    },
  });

  // Mutation para reactivar suscripción
  const reactivateMutation = useMutation({
    mutationFn: reactivateSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      toast({
        title: 'Suscripción reactivada',
        description: 'Tu suscripción ha sido reactivada exitosamente.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo reactivar la suscripción',
        variant: 'destructive',
      });
    },
  });

  // Mutation para crear preferencia de pago
  const paymentMutation = useMutation({
    mutationFn: createPaymentPreference,
    onSuccess: (data) => {
      // Redirigir a Mercado Pago
      const initPoint =
        process.env.NODE_ENV === 'production'
          ? data.initPoint
          : data.sandboxInitPoint || data.initPoint;
      window.location.href = initPoint;
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message ||
          'No se pudo crear la preferencia de pago. Verifica que tengas Mercado Pago configurado.',
        variant: 'destructive',
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'TRIAL':
        return <Badge variant="secondary">Período de Prueba</Badge>;
      case 'ACTIVE':
        return <Badge variant="default" className="bg-green-600">Activa</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelada</Badge>;
      case 'EXPIRED':
        return <Badge variant="destructive">Expirada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'TRIAL':
      case 'ACTIVE':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'CANCELLED':
      case 'EXPIRED':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>No tienes una suscripción activa</CardTitle>
            <CardDescription>
              Para comenzar a usar la plataforma, necesitas seleccionar un plan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/suscripcion/planes')}>
              Ver Planes Disponibles
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Mi Suscripción</h1>
        <p className="text-muted-foreground">
          Gestiona tu plan y configuración de suscripción
        </p>
      </div>

      {/* Estado de la Suscripción */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(subscription.status)}
              <div>
                <CardTitle>Plan {subscription.plan.name}</CardTitle>
                <CardDescription>{subscription.plan.description}</CardDescription>
              </div>
            </div>
            {getStatusBadge(subscription.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Precio */}
          <div>
            <p className="text-3xl font-bold">
              ${subscription.plan.price.toLocaleString('es-AR')}
              <span className="text-lg font-normal text-muted-foreground">
                /{subscription.plan.interval === 'month' ? 'mes' : 'año'}
              </span>
            </p>
          </div>

          <Separator />

          {/* Información del Período */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Inicio del Período</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(subscription.currentPeriodStart), "d 'de' MMMM, yyyy", {
                    locale: es,
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Fin del Período</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(subscription.currentPeriodEnd), "d 'de' MMMM, yyyy", {
                    locale: es,
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Trial Info */}
          {subscription.status === 'TRIAL' && subscription.trialEndsAt && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Período de Prueba</p>
                  <p className="text-sm text-blue-700">
                    Tu período de prueba gratuito termina el{' '}
                    {format(new Date(subscription.trialEndsAt), "d 'de' MMMM, yyyy", {
                      locale: es,
                    })}
                    . Después de esta fecha, se te cobrará automáticamente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cancelación Programada */}
          {subscription.cancelAtPeriodEnd && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">Cancelación Programada</p>
                  <p className="text-sm text-yellow-700">
                    Tu suscripción se cancelará al final del período actual el{' '}
                    {format(new Date(subscription.currentPeriodEnd), "d 'de' MMMM, yyyy", {
                      locale: es,
                    })}
                    .
                  </p>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Características del Plan */}
          <div>
            <h3 className="font-semibold mb-3">Características Incluidas</h3>
            <ul className="grid gap-2 md:grid-cols-2">
              {subscription.plan.features.maxServices && (
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    Hasta {subscription.plan.features.maxServices} servicios
                  </span>
                </li>
              )}
              {subscription.plan.features.maxAppointmentsPerMonth && (
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    {subscription.plan.features.maxAppointmentsPerMonth} turnos/mes
                  </span>
                </li>
              )}
              {subscription.plan.features.analytics && (
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Análisis y reportes</span>
                </li>
              )}
              {subscription.plan.features.customBranding && (
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Personalización de marca</span>
                </li>
              )}
              {subscription.plan.features.prioritySupport && (
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Soporte prioritario</span>
                </li>
              )}
              {subscription.plan.features.multipleLocations && (
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Múltiples ubicaciones</span>
                </li>
              )}
            </ul>
          </div>

          <Separator />

          {/* Acciones */}
          <div className="flex flex-wrap gap-3">
            {subscription.status === 'EXPIRED' ? (
              <Button
                onClick={() => paymentMutation.mutate()}
                disabled={paymentMutation.isPending}
                size="lg"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                {paymentMutation.isPending
                  ? 'Procesando...'
                  : 'Activar Suscripción Pro'}
              </Button>
            ) : subscription.status === 'CANCELLED' ? (
              <Button
                variant="outline"
                onClick={() => reactivateMutation.mutate()}
                disabled={reactivateMutation.isPending}
              >
                {reactivateMutation.isPending ? 'Reactivando...' : 'Reactivar Suscripción'}
              </Button>
            ) : (
              subscription.status !== 'TRIAL' && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirm('¿Estás seguro de que deseas cancelar tu suscripción?')) {
                      cancelMutation.mutate();
                    }
                  }}
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending ? 'Cancelando...' : 'Cancelar Suscripción'}
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Método de Pago */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Método de Pago
          </CardTitle>
          <CardDescription>
            Gestiona tu método de pago para la suscripción
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscription.mercadopagoSubscriptionId ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mercado Pago</p>
                <p className="text-sm text-muted-foreground">
                  ID: {subscription.mercadopagoSubscriptionId}
                </p>
              </div>
              <Button variant="outline">Actualizar Método de Pago</Button>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">
                No tienes un método de pago configurado
              </p>
              <Button>Agregar Método de Pago</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

