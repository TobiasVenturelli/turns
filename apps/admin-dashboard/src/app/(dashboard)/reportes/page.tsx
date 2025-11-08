/**
 * @file reportes/page.tsx
 * @description Página de reportes y estadísticas
 */

'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { appointmentsService } from '@/services/appointments.service';
import { servicesService } from '@/services/services.service';
import { businessService } from '@/services/business.service';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Download,
  Clock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ReportesPage() {
  const [period, setPeriod] = useState('30'); // días

  // Obtener datos
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => appointmentsService.getStats(),
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentsService.getAll(),
  });

  const { data: business } = useQuery({
    queryKey: ['my-business'],
    queryFn: () => businessService.getMyBusiness(),
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services', business?.id],
    queryFn: () => servicesService.getAll(business?.id || ''),
    enabled: !!business?.id,
  });

  // Procesar datos para gráficos
  const appointmentsByStatus = [
    { name: 'Completados', value: stats?.completedAppointments || 0, color: COLORS[1] },
    { name: 'Pendientes', value: stats?.pendingAppointments || 0, color: COLORS[0] },
    { name: 'Cancelados', value: stats?.cancelledAppointments || 0, color: COLORS[3] },
  ];

  // Servicios más solicitados
  const serviceStats = services.map((service) => {
    const count = appointments.filter((apt) => apt.serviceId === service.id).length;
    const revenue = appointments
      .filter((apt) => apt.serviceId === service.id && apt.status === 'COMPLETED')
      .reduce((sum, apt) => sum + (apt.service?.price || 0), 0);
    return {
      name: service.name,
      turnos: count,
      ingresos: revenue,
    };
  }).sort((a, b) => b.turnos - a.turnos).slice(0, 5);

  // Ingresos por mes (últimos 6 meses - mock)
  const monthlyRevenue = [
    { mes: 'Jun', ingresos: 15000 },
    { mes: 'Jul', ingresos: 18000 },
    { mes: 'Ago', ingresos: 22000 },
    { mes: 'Sep', ingresos: 19000 },
    { mes: 'Oct', ingresos: 25000 },
    { mes: 'Nov', ingresos: stats?.monthRevenue || 0 },
  ];

  const handleExportPDF = () => {
    alert('Función de exportar PDF estará disponible próximamente');
  };

  const handleExportExcel = () => {
    alert('Función de exportar Excel estará disponible próximamente');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reportes</h1>
          <p className="text-muted-foreground">
            Análisis y estadísticas de tu negocio
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 días</SelectItem>
              <SelectItem value="30">Últimos 30 días</SelectItem>
              <SelectItem value="90">Últimos 3 meses</SelectItem>
              <SelectItem value="365">Último año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos del Mes
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.monthRevenue || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Turnos Completados
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.completedAppointments || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalCustomers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Clientes activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasa de Ocupación
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              Promedio semanal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Ingresos por mes */}
        <Card>
          <CardHeader>
            <CardTitle>Ingresos Mensuales</CardTitle>
            <CardDescription>
              Evolución de ingresos en los últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ingresos"
                  stroke={COLORS[0]}
                  strokeWidth={2}
                  name="Ingresos ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Turnos por estado */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Turnos</CardTitle>
            <CardDescription>
              Turnos por estado en el período seleccionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appointmentsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {appointmentsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Servicios más solicitados */}
      <Card>
        <CardHeader>
          <CardTitle>Servicios Más Solicitados</CardTitle>
          <CardDescription>
            Top 5 servicios con más turnos e ingresos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {serviceStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={serviceStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="turnos" fill={COLORS[0]} name="Turnos" />
                <Bar yAxisId="right" dataKey="ingresos" fill={COLORS[1]} name="Ingresos ($)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No hay datos suficientes para mostrar
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

