/**
 * @file [businessSlug]/pago/error/page.tsx
 * @description Página de error de pago
 * @author Turns Team
 * @created 2025-11-08
 */

'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function PagoErrorPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const businessSlug = params.businessSlug as string;
  const paymentId = searchParams.get('payment_id');

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          <CardTitle className="text-3xl">Pago no procesado</CardTitle>
          <CardDescription className="text-base">
            Hubo un problema al procesar tu pago
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estado:</span>
                <span className="font-medium text-red-600">Rechazado</span>
              </div>
              {paymentId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID de pago:</span>
                  <span className="font-mono text-xs">{paymentId}</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
            <p className="font-medium text-red-900">¿Qué pasó?</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-red-800">
              <li>El pago fue rechazado por tu banco o tarjeta</li>
              <li>Puede haber fondos insuficientes</li>
              <li>La tarjeta puede estar vencida o bloqueada</li>
              <li>Hubo un error en los datos ingresados</li>
            </ul>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <p className="font-medium text-blue-900">Tu turno sigue reservado</p>
            <p className="mt-1 text-sm text-blue-800">
              No te preocupes, tu turno no se ha perdido. Puedes intentar pagar nuevamente o hacerlo más tarde desde &quot;Mis Turnos&quot;.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="flex-1">
              <Link href="/dashboard">
                <RefreshCw className="mr-2 h-4 w-4" />
                Intentar de nuevo
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/${businessSlug}`}>
                <Home className="mr-2 h-4 w-4" />
                Volver al negocio
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Si el problema persiste, contacta a tu banco o intenta con otro método de pago
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

