'use client';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Calendar, User, History, LogOut, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { businessService } from '@/services/business.service';

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const businessSlug = params.businessSlug as string;

  // Obtener información del negocio
  const { data: business } = useQuery({
    queryKey: ['business', businessSlug],
    queryFn: () => businessService.getBusinessBySlug(businessSlug),
    enabled: !!businessSlug,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${businessSlug}/login?redirect=${pathname}`);
    }
  }, [isAuthenticated, businessSlug, pathname, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      href: `/${businessSlug}/cliente/turnos`,
      label: 'Mis Turnos',
      icon: Calendar,
    },
    {
      href: `/${businessSlug}/cliente/perfil`,
      label: 'Mi Perfil',
      icon: User,
    },
    {
      href: `/${businessSlug}/cliente/historial`,
      label: 'Historial',
      icon: History,
    },
  ];

  const handleLogout = () => {
    logout();
    router.push(`/${businessSlug}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                asChild
              >
                <Link href={`/${businessSlug}`}>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-lg font-semibold">
                  {business?.name ? `Panel de Cliente - ${business.name}` : 'Panel de Cliente'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Hola, {user.name || user.email}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
            {/* Sidebar Navigation */}
            <aside className="space-y-2">
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </aside>

            {/* Main Content */}
            <main>{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}

