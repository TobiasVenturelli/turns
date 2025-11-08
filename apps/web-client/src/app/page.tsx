import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, CheckCircle, MapPin, ArrowRight } from "lucide-react";

// Obtener negocios disponibles
async function getBusinesses() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/v1/businesses`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return [];
  }
}

export default async function Home() {
  const businesses = await getBusinesses();
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Turns</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button>Registrarse</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight">
            Reserva turnos de forma{" "}
            <span className="text-primary">fácil y rápida</span>
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Agenda citas en tus negocios favoritos sin complicaciones
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="text-lg">
                Comenzar Gratis
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg">
                Ver Más
              </Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              ¿Por qué elegir Turns?
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <Clock className="mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-semibold">Ahorra Tiempo</h3>
                <p className="text-muted-foreground">
                  Reserva en segundos, sin llamadas ni esperas
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Calendar className="mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-semibold">Disponibilidad 24/7</h3>
                <p className="text-muted-foreground">
                  Agenda turnos cuando quieras, donde quieras
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Users className="mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-semibold">Múltiples Negocios</h3>
                <p className="text-muted-foreground">
                  Todos tus turnos en un solo lugar
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-semibold">Confirmación Instantánea</h3>
                <p className="text-muted-foreground">
                  Recibe notificaciones y recordatorios
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Negocios Disponibles */}
        {businesses.length > 0 && (
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold">
                  Negocios Disponibles
                </h2>
                <p className="text-xl text-muted-foreground">
                  Explora nuestros negocios y reserva tu turno
                </p>
              </div>
              <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
                {businesses.map((business: { id: string; name: string; slug: string; description: string | null; city: string | null; services: { name: string; price: number }[] }) => (
                  <Link key={business.id} href={`/${business.slug}`}>
                    <Card className="h-full transition-shadow hover:shadow-lg">
                      <CardHeader>
                        <CardTitle className="line-clamp-1">{business.name}</CardTitle>
                        {business.description && (
                          <CardDescription className="line-clamp-2">
                            {business.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        {business.city && (
                          <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{business.city}</span>
                          </div>
                        )}
                        {business.services && business.services.length > 0 && (
                          <div className="mb-4">
                            <p className="mb-2 text-sm font-medium">Servicios:</p>
                            <div className="space-y-1">
                              {business.services.slice(0, 3).map((service: { name: string; price: number }, idx: number) => (
                                <div key={idx} className="flex justify-between text-sm text-muted-foreground">
                                  <span className="line-clamp-1">{service.name}</span>
                                  <span className="ml-2 whitespace-nowrap font-medium">
                                    ${service.price.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <Button variant="outline" className="w-full">
                          Ver Más
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
        </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold">
              ¿Listo para comenzar?
            </h2>
            <p className="mb-8 text-xl text-muted-foreground">
              Únete a miles de usuarios que ya gestionan sus turnos con Turns
            </p>
            <Link href="/register">
              <Button size="lg" className="text-lg">
                Crear Cuenta Gratis
              </Button>
            </Link>
        </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Turns. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
