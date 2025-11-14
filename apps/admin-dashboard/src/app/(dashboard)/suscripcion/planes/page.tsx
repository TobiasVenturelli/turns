'use client';

/**
 * @file page.tsx
 * @description Página de selección de planes de suscripción
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  getPlans,
  getCurrentSubscription,
  createSubscription,
  changePlan,
  type SubscriptionPlan,
} from '@/services/subscriptions.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function PlanesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Query para obtener los planes
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

  // Mutation para crear suscripción
  const createMutation = useMutation({
    mutationFn: (planId: string) => createSubscription(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      toast({
        title: 'Suscripción creada',
        description: 'Tu período de prueba de 7 días ha comenzado.',
      });
      router.push('/suscripcion');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo crear la suscripción',
        variant: 'destructive',
      });
    },
  });

  // Mutation para cambiar plan
  const changePlanMutation = useMutation({
    mutationFn: (planId: string) => changePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      toast({
        title: 'Plan actualizado',
        description: 'Tu plan ha sido cambiado exitosamente.',
      });
      router.push('/suscripcion');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo cambiar el plan',
        variant: 'destructive',
      });
    },
  });

  const handleSelectPlan = (planId: string) => {
    if (currentSubscription) {
      // Si ya tiene suscripción, cambiar plan
      if (confirm('¿Estás seguro de que deseas cambiar tu plan?')) {
        changePlanMutation.mutate(planId);
      }
    } else {
      // Si no tiene suscripción, crear una nueva
      createMutation.mutate(planId);
    }
  };

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.planId === planId;
  };

  const getRecommendedPlan = () => {
    // El plan "Pro" es el recomendado
    return plans?.find((plan) => plan.name === 'Pro')?.id;
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

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Elige tu Plan</h1>
        <p className="text-xl text-muted-foreground">
          Comienza con 7 días de prueba gratuita. Sin tarjeta de crédito requerida.
        </p>
      </div>

      {/* Planes */}
      <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
        {plans?.map((plan) => {
          const isRecommended = plan.id === getRecommendedPlan();
          const isCurrent = isCurrentPlan(plan.id);

          return (
            <Card
              key={plan.id}
              className={`relative ${
                isRecommended ? 'border-primary shadow-lg scale-105' : ''
              }`}
            >
              {isRecommended && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge className="bg-primary text-primary-foreground">
                    Recomendado
                  </Badge>
                </div>
              )}

              {isCurrent && (
                <div className="absolute -top-4 right-4">
                  <Badge variant="secondary">Plan Actual</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="min-h-[40px]">
                  {plan.description}
                </CardDescription>
                <div className="pt-4">
                  <p className="text-4xl font-bold">
                    ${plan.price.toLocaleString('es-AR')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    por {plan.interval === 'month' ? 'mes' : 'año'}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Características */}
                <ul className="space-y-2">
                  {plan.features.maxServices && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">
                        {plan.features.maxServices === -1
                          ? 'Servicios ilimitados'
                          : `Hasta ${plan.features.maxServices} servicios`}
                      </span>
                    </li>
                  )}
                  {plan.features.maxAppointmentsPerMonth && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">
                        {plan.features.maxAppointmentsPerMonth === -1
                          ? 'Turnos ilimitados'
                          : `${plan.features.maxAppointmentsPerMonth} turnos por mes`}
                      </span>
                    </li>
                  )}
                  {plan.features.analytics && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análisis y reportes avanzados</span>
                    </li>
                  )}
                  {plan.features.customBranding && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Personalización de marca</span>
                    </li>
                  )}
                  {plan.features.prioritySupport && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Soporte prioritario 24/7</span>
                    </li>
                  )}
                  {plan.features.multipleLocations && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Múltiples ubicaciones</span>
                    </li>
                  )}
                </ul>

                {/* Botón */}
                <Button
                  className="w-full"
                  variant={isRecommended ? 'default' : 'outline'}
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={
                    isCurrent ||
                    createMutation.isPending ||
                    changePlanMutation.isPending
                  }
                >
                  {isCurrent
                    ? 'Plan Actual'
                    : currentSubscription
                    ? 'Cambiar a este Plan'
                    : 'Comenzar Prueba Gratuita'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Información Adicional */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Todos los planes incluyen 7 días de prueba gratuita. Cancela en cualquier momento.
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

