/**
 * @file configuracion/page.tsx
 * @description Página de configuración del negocio y horarios
 */

'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BusinessConfigTab } from '@/components/configuration/business-config-tab';
import { ScheduleConfigTab } from '@/components/configuration/schedule-config-tab';
import { PaymentsConfigTab } from '@/components/configuration/payments-config-tab';
import { Building2, Clock, CreditCard } from 'lucide-react';

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">
          Administra la configuración de tu negocio
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Negocio
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Horarios
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Pagos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business">
          <BusinessConfigTab />
        </TabsContent>

        <TabsContent value="schedule">
          <ScheduleConfigTab />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentsConfigTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

