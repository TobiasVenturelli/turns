/**
 * @file configuracion/pagos/callback/page.tsx
 * @description Página de callback de OAuth de Mercado Pago
 * @author Turns Team
 * @created 2025-11-08
 */

'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function MercadoPagoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Redirigir a configuración con los parámetros
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (code) {
      router.push(`/dashboard/configuracion?code=${code}${state ? `&state=${state}` : ''}`);
    } else {
      router.push('/dashboard/configuracion');
    }
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Procesando autorización...</p>
      </div>
    </div>
  );
}

