/**
 * @file trial-banner.tsx
 * @description Banner para mostrar el estado de la suscripción (trial o expirado)
 */

'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface TrialBannerProps {
  subscription: {
    status: 'TRIAL' | 'ACTIVE' | 'EXPIRED';
    trialEndsAt?: string | null;
    currentPeriodEnd?: string;
  };
}

export function TrialBanner({ subscription }: TrialBannerProps) {
  // TRIAL: Mostrar días restantes
  if (subscription.status === 'TRIAL' && subscription.trialEndsAt) {
    const now = new Date();
    const trialEnd = new Date(subscription.trialEndsAt);
    const daysLeft = Math.ceil(
      (trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    return (
      <Alert className="border-blue-200 bg-blue-50">
        <Clock className="h-5 w-5 text-blue-600" />
        <AlertTitle className="text-blue-900 font-semibold">
          ⏰ Período de Prueba Activo
        </AlertTitle>
        <AlertDescription className="text-blue-800">
          <div className="flex items-center justify-between mt-2">
            <div>
              <p className="font-medium">
                Te quedan {daysLeft} {daysLeft === 1 ? 'día' : 'días'} de
                prueba gratis
              </p>
              <p className="text-sm mt-1">
                Después: <span className="font-semibold">$20,000/mes</span>
              </p>
            </div>
            <Link href="/checkout">
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                Suscribirme Ahora
              </Button>
            </Link>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // EXPIRED: Suscripción expirada
  if (subscription.status === 'EXPIRED') {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <AlertTitle className="text-red-900 font-semibold">
          ⚠️ Suscripción Expirada
        </AlertTitle>
        <AlertDescription className="text-red-800">
          <div className="flex items-center justify-between mt-2">
            <div>
              <p className="font-medium">
                Tu período de prueba ha terminado
              </p>
              <p className="text-sm mt-1">
                Suscríbete para continuar usando Turns
              </p>
            </div>
            <Link href="/checkout">
              <Button variant="destructive">
                Suscribirme por $20,000/mes
              </Button>
            </Link>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // ACTIVE: Suscripción activa (mostrar próxima fecha de pago)
  if (subscription.status === 'ACTIVE' && subscription.currentPeriodEnd) {
    const nextPayment = new Date(subscription.currentPeriodEnd);
    const formattedDate = nextPayment.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-900 font-semibold">
          ✅ Suscripción Activa
        </AlertTitle>
        <AlertDescription className="text-green-800">
          <p className="text-sm">
            Próximo pago: <span className="font-semibold">{formattedDate}</span>
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

