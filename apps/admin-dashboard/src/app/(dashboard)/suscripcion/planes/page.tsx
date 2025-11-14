'use client';

/**
 * @file page.tsx
 * @description Página del plan Pro (único plan disponible)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import {
  getPlans,
  getCurrentSubscription,
  createPaymentPreference,
  activateAfterPayment,
  type SubscriptionPlan,
} from '@/services/subscriptions.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, CreditCard, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PlanesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Verificar si viene de un pago exitoso
  const paymentStatus = searchParams.get('payment');

  // Query para obtener el plan Pro (único plan)
  const { data: plans, isLoading: plansLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ['subscription', 'plans'],
    queryFn: getPlans,
  });

  // Query para obtener la suscripción actual
  const { data: currentSubscription } = useQuery({
    queryKey: ['subscription', 'current'],
    queryFn: getCurrentSubscription,
    retry: false,
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

  // Mutation para activar después del pago
  const activateMutation = useMutation({
    mutationFn: () => activateAfterPayment(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      toast({
        title: '¡Suscripción activada!',
        description: 'Tu suscripción Pro ha sido activada exitosamente.',
      });
      router.push('/suscripcion');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'No se pudo activar la suscripción',
        variant: 'destructive',
      });
    },
  });

  // Manejar callback de pago
  useEffect(() => {
    if (paymentStatus === 'success') {
      // Activar suscripción después de pago exitoso
      activateMutation.mutate();
    } else if (paymentStatus === 'failure') {
      toast({
        title: 'Pago fallido',
        description: 'No se pudo procesar el pago. Intenta nuevamente.',
        variant: 'destructive',
      });
    } else if (paymentStatus === 'pending') {
      toast({
        title: 'Pago pendiente',
        description: 'Tu pago está siendo procesado. Te notificaremos cuando se complete.',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentStatus]);

  const plan = plans?.[0]; // Solo hay un plan: Pro

  const handlePayNow = () => {
    if (!currentSubscription) {
      toast({
        title: 'Error',
        description: 'No se encontró tu suscripción. Por favor, recarga la página.',
        variant: 'destructive',
      });
      return;
    }

    // Verificar que la suscripción esté en TRIAL o EXPIRED
    if (
      currentSubscription.status !== 'TRIAL' &&
      currentSubscription.status !== 'EXPIRED'
    ) {
      toast({
        title: 'No es necesario',
        description: 'Tu suscripción ya está activa.',
      });
      return;
    }

    paymentMutation.mutate();
  };

  if (plansLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Plan no disponible</CardTitle>
            <CardDescription>
              No se pudo cargar el plan. Por favor, recarga la página.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const isTrial = currentSubscription?.status === 'TRIAL';
  const isExpired = currentSubscription?.status === 'EXPIRED';
  const isActive = currentSubscription?.status === 'ACTIVE';

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Plan Pro</h1>
        <p className="text-xl text-muted-foreground">
          {isTrial
            ? 'Estás en tu período de prueba gratuita de 7 días'
            : isExpired
            ? 'Tu período de prueba ha expirado. Activa tu suscripción para continuar.'
            : isActive
            ? 'Tu suscripción está activa'
            : 'Comienza con 7 días de prueba gratuita. Sin tarjeta de crédito requerida.'}
        </p>
      </div>

      {/* Plan Pro */}
      <div className="max-w-2xl mx-auto">
        <Card className="relative border-primary shadow-lg">
          {isActive && (
            <div className="absolute -top-4 right-4">
              <Badge variant="secondary" className="bg-green-600">
                Plan Actual
              </Badge>
            </div>
          )}

          {isTrial && (
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <Badge className="bg-blue-600 text-white">
                Período de Prueba
              </Badge>
            </div>
          )}

          {isExpired && (
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <Badge variant="destructive">Suscripción Expirada</Badge>
            </div>
          )}

          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl">{plan.name}</CardTitle>
            <CardDescription className="min-h-[40px] text-base">
              {plan.description}
            </CardDescription>
            <div className="pt-4">
              <p className="text-5xl font-bold">
                ${plan.price.toLocaleString('es-AR')}
              </p>
              <p className="text-sm text-muted-foreground">
                por {plan.interval === 'month' ? 'mes' : 'año'}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Características */}
            <div>
              <h3 className="font-semibold mb-3">Características Incluidas</h3>
              <ul className="space-y-3">
                {plan.features.maxServices && (
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      {plan.features.maxServices === -1
                        ? 'Servicios ilimitados'
                        : `Hasta ${plan.features.maxServices} servicios`}
                    </span>
                  </li>
                )}
                {plan.features.maxAppointmentsPerMonth && (
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      {plan.features.maxAppointmentsPerMonth === -1
                        ? 'Turnos ilimitados'
                        : `${plan.features.maxAppointmentsPerMonth} turnos por mes`}
                    </span>
                  </li>
                )}
                {plan.features.analytics && (
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Análisis y reportes avanzados</span>
                  </li>
                )}
                {plan.features.customBranding && (
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Personalización de marca</span>
                  </li>
                )}
                {plan.features.prioritySupport && (
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Soporte prioritario 24/7</span>
                  </li>
                )}
                {plan.features.multipleLocations && (
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Múltiples ubicaciones</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Alerta si está expirado */}
            {isExpired && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">
                      Tu período de prueba ha expirado
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      Para continuar usando la plataforma, necesitas activar tu
                      suscripción Pro.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Botón de acción */}
            <div className="space-y-3">
              {isExpired ? (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePayNow}
                  disabled={paymentMutation.isPending}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  {paymentMutation.isPending
                    ? 'Procesando...'
                    : 'Activar Suscripción Pro'}
                </Button>
              ) : isTrial ? (
                <Button
                  className="w-full"
                  size="lg"
                  variant="outline"
                  onClick={() => router.push('/suscripcion')}
                >
                  Ver Estado de Mi Suscripción
                </Button>
              ) : isActive ? (
                <Button
                  className="w-full"
                  size="lg"
                  variant="outline"
                  onClick={() => router.push('/suscripcion')}
                >
                  Gestionar Suscripción
                </Button>
              ) : (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => router.push('/suscripcion')}
                >
                  Ver Detalles
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información Adicional */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          {isTrial
            ? 'Tu período de prueba incluye acceso completo a todas las funcionalidades. Después de 7 días, se te cobrará automáticamente.'
            : '7 días de prueba gratuita. Sin tarjeta de crédito requerida. Cancela en cualquier momento.'}
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>Sin tarjeta de crédito requerida</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>Cancela cuando quieras</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>Soporte en español</span>
          </div>
        </div>
      </div>
    </div>
  );
}

