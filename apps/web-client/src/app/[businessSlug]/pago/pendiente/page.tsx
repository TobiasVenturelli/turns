/**
 * @file [businessSlug]/pago/pendiente/page.tsx
 * @description Página de pago pendiente
 * @author Turns Team
 * @created 2025-11-08
 */

'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, Home, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function PagoPendientePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const businessSlug = params.businessSlug as string;
  const paymentId = searchParams.get('payment_id');

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
            <Clock className="h-12 w-12 text-yellow-600" />
          </div>
          <CardTitle className="text-3xl">Pago pendiente</CardTitle>
          <CardDescription className="text-base">
            Tu pago está siendo procesado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estado:</span>
                <span className="font-medium text-yellow-600">Pendiente</span>
              </div>
              {paymentId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID de pago:</span>
                  <span className="font-mono text-xs">{paymentId}</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-900">¿Qué significa esto?</p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-yellow-800">
                  <li>Tu pago está siendo verificado</li>
                  <li>Puede tardar algunos minutos u horas</li>
                  <li>Recibirás un email cuando se confirme</li>
                  <li>No es necesario realizar otro pago</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Clock className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Turno reservado</p>
                <p className="text-sm text-muted-foreground">
                  Tu turno está reservado mientras se procesa el pago
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Te notificaremos</p>
                <p className="text-sm text-muted-foreground">
                  Recibirás un email cuando el pago sea confirmado o rechazado
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="flex-1">
              <Link href="/dashboard">
                <Calendar className="mr-2 h-4 w-4" />
                Ver mis turnos
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/${businessSlug}`}>
                <Home className="mr-2 h-4 w-4" />
                Volver al negocio
              </Link>
            </Button>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
            <p className="font-medium">Métodos de pago que pueden quedar pendientes:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Pago en efectivo (Rapipago, Pago Fácil)</li>
              <li>Transferencia bancaria</li>
              <li>Algunos pagos con tarjeta de débito</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

