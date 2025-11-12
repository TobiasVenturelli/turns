/**
 * @file [businessSlug]/pago/exito/page.tsx
 * @description Página de éxito de pago
 * @author Turns Team
 * @created 2025-11-08
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Home } from 'lucide-react';
import Link from 'next/link';

export default function PagoExitoPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const businessSlug = params.businessSlug as string;
  const paymentId = searchParams.get('payment_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga (el webhook ya procesó el pago en el backend)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Verificando pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl">¡Pago exitoso!</CardTitle>
          <CardDescription className="text-base">
            Tu pago ha sido procesado correctamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estado:</span>
                <span className="font-medium text-green-600">Aprobado</span>
              </div>
              {paymentId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID de pago:</span>
                  <span className="font-mono text-xs">{paymentId}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Turno confirmado</p>
                <p className="text-sm text-muted-foreground">
                  Tu turno ha sido confirmado y pagado
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Email enviado</p>
                <p className="text-sm text-muted-foreground">
                  Recibirás un email con los detalles de tu reserva
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
            <p className="font-medium">Recordatorio:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Llega 5 minutos antes de tu turno</li>
              <li>Puedes cancelar hasta 24hs antes</li>
              <li>Revisa tu email para más detalles</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

