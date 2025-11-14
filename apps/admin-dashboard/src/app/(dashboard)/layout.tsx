/**
 * @file (dashboard)/layout.tsx
 * @description Layout del dashboard con sidebar y header
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { SubscriptionBanner } from '@/components/subscription/subscription-banner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Verificar que sea PROFESSIONAL
    if (user && user.role !== 'PROFESSIONAL') {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="p-6">
          <SubscriptionBanner />
          {children}
        </main>
      </div>
    </div>
  );
}

