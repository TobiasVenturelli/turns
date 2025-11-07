/**
 * @file [businessSlug]/not-found.tsx
 * @description Página 404 para negocios no encontrados
 * @author Turns Team
 * @created 2025-11-07
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Home } from 'lucide-react';

export default function BusinessNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Search className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-4xl font-bold">Negocio no encontrado</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Lo sentimos, el negocio que buscas no existe o ha sido desactivado.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button size="lg">
              <Home className="mr-2 h-5 w-5" />
              Volver al Inicio
            </Button>
          </Link>
          <Link href="/buscar">
            <Button size="lg" variant="outline">
              <Search className="mr-2 h-5 w-5" />
              Buscar Negocios
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

