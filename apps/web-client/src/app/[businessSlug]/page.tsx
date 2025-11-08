/**
 * @file [businessSlug]/page.tsx
 * @description Página pública de un negocio
 * @author Turns Team
 * @created 2025-11-07
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar,
  ArrowRight,
  Star,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BusinessMap } from '@/components/business/BusinessMap';
import { BusinessRating } from '@/components/business/BusinessRating';

// Nota: Esta función se ejecuta en el servidor
async function getBusinessData(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/v1/businesses/${slug}`, {
      cache: 'no-store', // Siempre obtener datos frescos
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching business:', error);
    return null;
  }
}

const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default async function BusinessPage({ params }: { params: { businessSlug: string } }) {
  const { businessSlug } = params;
  const business = await getBusinessData(businessSlug);

  if (!business) {
    notFound();
  }

  // Agrupar horarios por día
  const scheduleByDay = business.schedules.reduce((acc: Record<number, { startTime: string; endTime: string }>, schedule: { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }) => {
    if (schedule.isActive) {
      acc[schedule.dayOfWeek] = {
        startTime: schedule.startTime,
        endTime: schedule.endTime,
      };
    }
    return acc;
  }, {});

  // Schema.org structured data para SEO
  const schemaOrgData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: business.description || `Servicios profesionales en ${business.city || ''}`,
    image: business.logo || undefined,
    telephone: business.phone || undefined,
    email: business.email || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address || undefined,
      addressLocality: business.city || undefined,
      addressRegion: business.state || undefined,
      postalCode: business.zipCode || undefined,
      addressCountry: business.country || 'AR',
    },
    geo: (business.latitude && business.longitude) ? {
      '@type': 'GeoCoordinates',
      latitude: business.latitude,
      longitude: business.longitude,
    } : undefined,
    aggregateRating: business.rating > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: business.rating,
      reviewCount: business.reviewCount,
    } : undefined,
    openingHoursSpecification: business.schedules
      .filter((s: { isActive: boolean }) => s.isActive)
      .map((schedule: { dayOfWeek: number; startTime: string; endTime: string }) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][schedule.dayOfWeek],
        opens: schedule.startTime,
        closes: schedule.endTime,
      })),
    priceRange: '$$',
    url: `${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3001'}/${businessSlug}`,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgData) }}
      />
      
      {/* Header/Hero Section */}
      <div className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-4xl">
            {/* Business Logo and Name */}
            <div className="mb-6 flex items-start gap-6">
              {business.logo && (
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 border-primary/20 shadow-md">
                  <Image
                    src={business.logo}
                    alt={`Logo de ${business.name}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="mb-2 text-4xl font-bold tracking-tight">{business.name}</h1>
                {business.description && (
                  <p className="text-xl text-muted-foreground">{business.description}</p>
                )}
                {/* Rating en el header */}
                {business.rating > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center">
                      {Array.from({ length: Math.floor(business.rating) }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">
                      {business.rating.toFixed(1)} ({business.reviewCount} {business.reviewCount === 1 ? 'reseña' : 'reseñas'})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 text-sm">
              {business.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{business.address}, {business.city}</span>
                </div>
              )}
              {business.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${business.phone}`} className="hover:underline">
                    {business.phone}
                  </a>
                </div>
              )}
              {business.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${business.email}`} className="hover:underline">
                    {business.email}
                  </a>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <div className="mt-8">
              <Link href={`/${businessSlug}/reservar`}>
                <Button size="lg" className="text-lg">
                  <Calendar className="mr-2 h-5 w-5" />
                  Reservar Turno
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Services Section - Takes 2 columns */}
            <div className="lg:col-span-2">
              <h2 className="mb-6 text-2xl font-bold">Nuestros Servicios</h2>
              <div className="grid gap-4">
                {business.services.map((service: { id: string; name: string; description: string | null; duration: number; price: number; color: string | null }) => (
                  <Card key={service.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {service.color && (
                              <div 
                                className="h-3 w-3 rounded-full" 
                                style={{ backgroundColor: service.color }}
                              />
                            )}
                            {service.name}
                          </CardTitle>
                          {service.description && (
                            <CardDescription className="mt-1">
                              {service.description}
                            </CardDescription>
                          )}
                        </div>
                        <Badge variant="secondary" className="ml-2 whitespace-nowrap">
                          ${service.price.toLocaleString()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{service.duration} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>${service.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar - Takes 1 column */}
            <div className="space-y-6">
              {/* Rating Card */}
              <BusinessRating 
                rating={business.rating || 0} 
                reviewCount={business.reviewCount || 0} 
              />

              {/* Schedule Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Horarios de Atención
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {DAYS_OF_WEEK.map((day, index) => {
                      const schedule = scheduleByDay[index];
                      return (
                        <div key={index} className="flex justify-between">
                          <span className={schedule ? 'font-medium' : 'text-muted-foreground'}>
                            {day}
                          </span>
                          <span className={schedule ? '' : 'text-muted-foreground'}>
                            {schedule 
                              ? `${schedule.startTime} - ${schedule.endTime}`
                              : 'Cerrado'
                            }
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Owner Card */}
              {business.user && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Profesional</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      {business.user.avatar ? (
                        <div className="relative h-12 w-12 overflow-hidden rounded-full">
                          <Image
                            src={business.user.avatar}
                            alt={`${business.user.firstName} ${business.user.lastName}`}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                          {business.user.firstName[0]}{business.user.lastName[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">
                          {business.user.firstName} {business.user.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Profesional certificado
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Location Card with Map */}
              {(business.address || (business.latitude && business.longitude)) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MapPin className="h-4 w-4" />
                      Ubicación
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {business.address && (
                      <div>
                        <p className="text-sm font-medium">
                          {business.address}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {business.city}{business.state ? `, ${business.state}` : ''}
                        </p>
                        {business.zipCode && (
                          <p className="text-sm text-muted-foreground">
                            CP: {business.zipCode}
                          </p>
                        )}
                      </div>
                    )}
                    <BusinessMap
                      address={business.address}
                      city={business.city}
                      state={business.state}
                      latitude={business.latitude}
                      longitude={business.longitude}
                    />
                    {(business.latitude && business.longitude) && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          <MapPin className="mr-2 h-4 w-4" />
                          Cómo llegar
                        </Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {business.phone && (
                    <a
                      href={`tel:${business.phone}`}
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      {business.phone}
                    </a>
                  )}
                  {business.email && (
                    <a
                      href={`mailto:${business.email}`}
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {business.email}
                    </a>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">¿Listo para reservar?</h3>
              <p className="text-muted-foreground">Elige tu servicio y horario preferido</p>
            </div>
            <Link href={`/${businessSlug}/reservar`}>
              <Button size="lg">
                Reservar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metadata dinámica para SEO
export async function generateMetadata({ params }: { params: { businessSlug: string } }) {
  const { businessSlug } = params;
  const business = await getBusinessData(businessSlug);

  if (!business) {
    return {
      title: 'Negocio no encontrado',
    };
  }

  const title = `${business.name} - Reserva tu turno online`;
  const description = business.description || 
    `Reserva tu turno en ${business.name}${business.city ? ` en ${business.city}` : ''}. Servicios profesionales de calidad.`;
  
  const url = `${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3001'}/${businessSlug}`;
  const images = business.logo ? [business.logo] : [];

  return {
    title,
    description,
    keywords: [
      business.name,
      'reserva de turnos',
      'turnos online',
      business.city || '',
      business.state || '',
      'peluquería',
      'servicios de belleza',
    ].filter(Boolean).join(', '),
    authors: [{ name: business.user ? `${business.user.firstName} ${business.user.lastName}` : business.name }],
    openGraph: {
      type: 'website',
      locale: 'es_AR',
      url,
      title,
      description,
      siteName: 'Turns - Sistema de Gestión de Turnos',
      images: images.length > 0 ? images : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.length > 0 ? images : undefined,
    },
    alternates: {
      canonical: url,
    },
    // Schema.org structured data
    other: {
      'business:contact_data:street_address': business.address || '',
      'business:contact_data:locality': business.city || '',
      'business:contact_data:region': business.state || '',
      'business:contact_data:postal_code': business.zipCode || '',
      'business:contact_data:country_name': business.country || 'Argentina',
      'business:contact_data:phone_number': business.phone || '',
      'business:contact_data:email': business.email || '',
    },
  };
}

