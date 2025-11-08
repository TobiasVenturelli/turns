/**
 * @file BusinessMap.tsx
 * @description Componente para mostrar el mapa de Google Maps con la ubicación del negocio
 * @author Turns Team
 * @created 2025-11-07
 */

'use client';

import { MapPin } from 'lucide-react';

interface BusinessMapProps {
  address?: string | null;
  city?: string | null;
  state?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

/**
 * Componente que muestra un mapa de Google Maps con la ubicación del negocio
 * Usa iframe embed de Google Maps (no requiere API key)
 */
export function BusinessMap({
  address,
  city,
  state,
  latitude,
  longitude,
}: BusinessMapProps) {
  // Si tenemos coordenadas, usarlas directamente
  if (latitude && longitude) {
    // Usar Google Maps con coordenadas (formato más simple y confiable)
    const embedUrl = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`;
    
    return (
      <div className="w-full h-64 rounded-lg overflow-hidden border">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={embedUrl}
          title="Ubicación del negocio"
        />
      </div>
    );
  }

  // Si no hay coordenadas pero hay dirección, construir query para Google Maps
  if (address && city) {
    const query = encodeURIComponent(`${address}, ${city}${state ? `, ${state}` : ''}`);
    // Usar Google Maps con búsqueda (no requiere API key para embed básico)
    const searchUrl = `https://www.google.com/maps?q=${query}&output=embed`;
    
    return (
      <div className="w-full h-64 rounded-lg overflow-hidden border">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={searchUrl}
          title="Ubicación del negocio"
        />
      </div>
    );
  }

  // Si no hay información de ubicación, mostrar mensaje
  return (
    <div className="flex h-64 items-center justify-center rounded-lg border bg-muted">
      <div className="text-center">
        <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          Ubicación no disponible
        </p>
      </div>
    </div>
  );
}

