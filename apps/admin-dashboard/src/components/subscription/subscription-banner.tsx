'use client';

/**
 * @file subscription-banner.tsx
 * @description Banner que muestra el estado de la suscripción (trial, expirada, etc.)
 */

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  getCurrentSubscription,
  getSubscriptionStatus,
  type Subscription,
  type SubscriptionStatus,
} from '@/services/subscriptions.service';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, XCircle } from 'lucide-react';
import { differenceInDays } from 'date-fns';

export function SubscriptionBanner() {
  const router = useRouter();

  // Query para obtener la suscripción actual
  const { data: subscription } = useQuery<Subscription>({
    queryKey: ['subscription', 'current'],
    queryFn: getCurrentSubscription,
    retry: false,
  });

  // Query para obtener el estado
  const { data: status } = useQuery<SubscriptionStatus>({
    queryKey: ['subscription', 'status'],
    queryFn: getSubscriptionStatus,
    retry: false,
  });

  // No mostrar banner si no hay suscripción o está activa sin problemas
  if (!subscription || (subscription.status === 'ACTIVE' && !subscription.cancelAtPeriodEnd)) {
    return null;
  }

  // Banner para Trial
  if (subscription.status === 'TRIAL' && subscription.trialEndsAt) {
    const daysRemaining = differenceInDays(
      new Date(subscription.trialEndsAt),
      new Date()
    );

    return (
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900">
              Período de Prueba - {daysRemaining} {daysRemaining === 1 ? 'día' : 'días'}{' '}
              restantes
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Estás usando el plan {subscription.plan.name} en modo de prueba. Después de{' '}
              {daysRemaining} {daysRemaining === 1 ? 'día' : 'días'}, se te cobrará{' '}
              ${subscription.plan.price.toLocaleString('es-AR')}/mes automáticamente.
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={() => router.push('/suscripcion/planes')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Ver Planes
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push('/suscripcion')}
              >
                Gestionar Suscripción
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Banner para Suscripción Expirada
  if (subscription.status === 'EXPIRED') {
    return (
      <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6">
        <div className="flex items-start gap-3">
          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900">Suscripción Expirada</h3>
            <p className="text-sm text-red-700 mt-1">
              Tu suscripción ha expirado. Algunas funcionalidades están limitadas. Renueva tu
              suscripción para continuar usando todas las características.
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={() => router.push('/suscripcion/planes')}
                className="bg-red-600 hover:bg-red-700"
              >
                Renovar Ahora
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push('/suscripcion')}
              >
                Ver Detalles
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Banner para Suscripción Cancelada
  if (subscription.status === 'CANCELLED' && subscription.cancelAtPeriodEnd) {
    const daysRemaining = differenceInDays(
      new Date(subscription.currentPeriodEnd),
      new Date()
    );

    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900">Suscripción Cancelada</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Tu suscripción se cancelará en {daysRemaining}{' '}
              {daysRemaining === 1 ? 'día' : 'días'}. Después de eso, tu acceso será limitado.
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={() => router.push('/suscripcion')}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Reactivar Suscripción
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push('/suscripcion/planes')}
              >
                Ver Otros Planes
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

