/**
 * @file [businessSlug]/page.tsx
 * @description Página pública de un negocio
 * @author Turns Team
 * @created 2025-11-07
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
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

export default async function BusinessPage({ 
  params 
}: { 
  params: Promise<{ businessSlug: string }> 
}) {
  const { businessSlug } = await params;
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Hero Section */}
      <div className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-4xl">
            {/* Business Name */}
            <div className="mb-6">
              <h1 className="mb-2 text-4xl font-bold tracking-tight">{business.name}</h1>
              {business.description && (
                <p className="text-xl text-muted-foreground">{business.description}</p>
              )}
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
              {business.owner && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Profesional</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {business.owner.firstName[0]}{business.owner.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium">
                          {business.owner.firstName} {business.owner.lastName}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>5.0 (24 reseñas)</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Location Card */}
              {business.address && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MapPin className="h-4 w-4" />
                      Ubicación
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {business.address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {business.city}, {business.state}
                    </p>
                    {business.zipCode && (
                      <p className="text-sm text-muted-foreground">
                        CP: {business.zipCode}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
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
export async function generateMetadata({ params }: { params: Promise<{ businessSlug: string }> }) {
  const { businessSlug } = await params;
  const business = await getBusinessData(businessSlug);

  if (!business) {
    return {
      title: 'Negocio no encontrado',
    };
  }

  return {
    title: `${business.name} - Reserva tu turno online`,
    description: business.description || `Reserva tu turno en ${business.name}. ${business.city}, ${business.country}`,
    openGraph: {
      title: business.name,
      description: business.description || '',
      images: business.logo ? [business.logo] : [],
    },
  };
}

