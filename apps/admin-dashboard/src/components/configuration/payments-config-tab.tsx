/**
 * @file payments-config-tab.tsx
 * @description Tab de configuración de pagos con Mercado Pago
 */

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { businessService } from '@/services/business.service';
import { CreditCard, CheckCircle, XCircle, Save, ExternalLink } from 'lucide-react';

export function PaymentsConfigTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [depositPercentage, setDepositPercentage] = useState('50');

  // Obtener negocio del profesional
  const { data: business, isLoading } = useQuery({
    queryKey: ['my-business'],
    queryFn: () => businessService.getMyBusiness(),
  });

  // Estado de conexión con Mercado Pago (mock)
  const [isMercadoPagoConnected, setIsMercadoPagoConnected] = useState(false);

  // Mutación para actualizar configuración
  const updateMutation = useMutation({
    mutationFn: (data: any) => businessService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-business'] });
      toast({
        title: 'Configuración guardada',
        description: 'La configuración de pagos se ha actualizado',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la configuración',
        variant: 'destructive',
      });
    },
  });

  const handleConnectMercadoPago = () => {
    // En producción, esto redirige al OAuth de Mercado Pago
    toast({
      title: 'Conectar Mercado Pago',
      description: 'Esta función estará disponible próximamente',
    });
  };

  const handleDisconnectMercadoPago = () => {
    if (confirm('¿Estás seguro de que deseas desconectar Mercado Pago?')) {
      setIsMercadoPagoConnected(false);
      toast({
        title: 'Desconectado',
        description: 'Mercado Pago se ha desconectado correctamente',
      });
    }
  };

  const handleSave = () => {
    updateMutation.mutate({
      depositPercentage: parseInt(depositPercentage),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Conexión con Mercado Pago */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Mercado Pago
          </CardTitle>
          <CardDescription>
            Conecta tu cuenta de Mercado Pago para recibir pagos online
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div
                className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                  isMercadoPagoConnected ? 'bg-green-100' : 'bg-gray-100'
                }`}
              >
                <CreditCard
                  className={`h-6 w-6 ${
                    isMercadoPagoConnected ? 'text-green-600' : 'text-gray-600'
                  }`}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">Mercado Pago</p>
                  {isMercadoPagoConnected ? (
                    <Badge variant="outline" className="bg-green-50">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                      Conectado
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-50">
                      <XCircle className="h-3 w-3 mr-1 text-gray-600" />
                      Desconectado
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {isMercadoPagoConnected
                    ? 'Recibiendo pagos de clientes'
                    : 'Conecta para recibir pagos online'}
                </p>
              </div>
            </div>
            {isMercadoPagoConnected ? (
              <Button variant="outline" onClick={handleDisconnectMercadoPago}>
                Desconectar
              </Button>
            ) : (
              <Button onClick={handleConnectMercadoPago}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Conectar
              </Button>
            )}
          </div>

          {isMercadoPagoConnected && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Nota:</strong> Mercado Pago cobra una comisión por cada
                transacción. Las comisiones varían según el tipo de pago y el país.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuración de señas */}
      <Card>
        <CardHeader>
          <CardTitle>Señas y Anticipos</CardTitle>
          <CardDescription>
            Configura el porcentaje de seña que deben pagar los clientes al reservar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="depositPercentage">
              Porcentaje de seña (%)
            </Label>
            <Input
              id="depositPercentage"
              type="number"
              value={depositPercentage}
              onChange={(e) => setDepositPercentage(e.target.value)}
              min="0"
              max="100"
              step="5"
              disabled={!isMercadoPagoConnected}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Los clientes pagarán este porcentaje al reservar. El resto se paga en el local.
            </p>
          </div>

          {!isMercadoPagoConnected && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-900">
                Conecta Mercado Pago para habilitar el cobro de señas
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historial de pagos */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
          <CardDescription>
            Últimos pagos recibidos de tus clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No hay pagos registrados aún
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Botón de guardar */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending || !isMercadoPagoConnected}
        >
          <Save className="h-4 w-4 mr-2" />
          {updateMutation.isPending ? 'Guardando...' : 'Guardar Configuración'}
        </Button>
      </div>
    </div>
  );
}

