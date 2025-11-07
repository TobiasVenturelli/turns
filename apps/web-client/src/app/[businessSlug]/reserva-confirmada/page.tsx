/**
 * @file reserva-confirmada/page.tsx
 * @description Página de confirmación de reserva exitosa
 * @author Turns Team
 * @created 2025-11-07
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Calendar, Home } from 'lucide-react';

export default function ReservaConfirmadaPage({
  params,
}: {
  params: Promise<{ businessSlug: string }>;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">¡Reserva Confirmada!</CardTitle>
          <CardDescription>
            Tu turno ha sido reservado exitosamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Te hemos enviado un email de confirmación con todos los detalles de tu reserva.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Recordatorios importantes:</p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Llega 5 minutos antes de tu cita</li>
              <li>Revisa tu email para más detalles</li>
              <li>Puedes cancelar hasta 24hs antes</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Link href="/dashboard">
              <Button className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Ver Mis Turnos
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Volver al Inicio
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

