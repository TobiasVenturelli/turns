/**
 * @file payments-config-tab.tsx
 * @description Tab de configuración de pagos con OAuth de Mercado Pago
 * @author Turns Team
 * @created 2025-11-08
 */

'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { paymentsService } from '@/services/payments.service';
import { businessService } from '@/services/business.service';
import { useToast } from '@/hooks/use-toast';

export function PaymentsConfigTab() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Obtener negocio actual
  const { data: business } = useQuery({
    queryKey: ['my-business'],
    queryFn: () => businessService.getMyBusiness(),
  });

  // Obtener estado de conexión de Mercado Pago
  const { data: mpStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: ['mercadopago-status', business?.id],
    queryFn: () => paymentsService.getMercadoPagoStatus(business!.id),
    enabled: !!business?.id,
  });

  // Mutation para desconectar Mercado Pago
  const disconnectMutation = useMutation({
    mutationFn: () => paymentsService.disconnectMercadoPago(business!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mercadopago-status'] });
      queryClient.invalidateQueries({ queryKey: ['my-business'] });
      toast({
        title: 'Mercado Pago desconectado',
        description: 'Tu cuenta de Mercado Pago ha sido desconectada',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error al desconectar',
        description: error.message || 'No se pudo desconectar Mercado Pago',
        variant: 'destructive',
      });
    },
  });

  // Manejar callback de OAuth desde URL
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code && business?.id) {
        try {
          const redirectUri = localStorage.getItem('mp_redirect_uri') || 
            `${window.location.origin}/dashboard/configuracion`;

          await paymentsService.connectMercadoPago(business.id, { code, redirectUri });

          // Limpiar URL y localStorage
          window.history.replaceState({}, '', '/dashboard/configuracion');
          localStorage.removeItem('mp_redirect_uri');

          // Refrescar datos
          queryClient.invalidateQueries({ queryKey: ['mercadopago-status'] });
          queryClient.invalidateQueries({ queryKey: ['my-business'] });

          toast({
            title: 'Mercado Pago conectado',
            description: 'Tu cuenta de Mercado Pago ha sido conectada exitosamente',
          });
        } catch (error) {
          toast({
            title: 'Error al conectar',
            description: 'No se pudo completar la conexión con Mercado Pago',
            variant: 'destructive',
          });
        }
      }
    };

    handleOAuthCallback();
  }, [business?.id, queryClient, toast]);

  const handleConnectMercadoPago = async () => {
    if (!business?.id) {
      toast({
        title: 'Error',
        description: 'No se encontró el negocio',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      const { authUrl, redirectUri } = await paymentsService.getMercadoPagoAuthUrl(business.id);
      
      // Guardar redirectUri en localStorage para el callback
      localStorage.setItem('mp_redirect_uri', redirectUri);
      
      // Redirigir a Mercado Pago
      window.location.href = authUrl;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo obtener la URL de autorización',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handleDisconnectMercadoPago = async () => {
    if (!business?.id) return;

    if (confirm('¿Estás seguro de que deseas desconectar Mercado Pago?')) {
      disconnectMutation.mutate();
    }
  };

  const isConnected = mpStatus?.isConnected || false;

  if (isLoadingStatus) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          {/* Estado de conexión */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              {isConnected ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Cuenta conectada</p>
                    <p className="text-sm text-muted-foreground">
                      {mpStatus?.mercadopagoUserId && `ID: ${mpStatus.mercadopagoUserId}`}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">No conectado</p>
                    <p className="text-sm text-muted-foreground">
                      Conecta tu cuenta para recibir pagos
                    </p>
                  </div>
                </>
              )}
            </div>
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {isConnected ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>

          {/* Información */}
          {!isConnected && (
            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
              <p className="font-medium mb-2">¿Cómo funciona?</p>
              <ol className="list-inside list-decimal space-y-1">
                <li>Haz clic en "Conectar Mercado Pago"</li>
                <li>Inicia sesión en tu cuenta de Mercado Pago</li>
                <li>Autoriza la conexión con Turns</li>
                <li>¡Listo! Podrás recibir pagos online</li>
              </ol>
            </div>
          )}

          {isConnected && (
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-900">
              <p className="font-medium mb-2">✓ Cuenta activa</p>
              <p>
                Tus clientes pueden pagar sus turnos online con Mercado Pago.
                Las comisiones de Mercado Pago se aplican automáticamente.
              </p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3">
            {!isConnected ? (
              <Button
                onClick={handleConnectMercadoPago}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Conectar Mercado Pago
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleDisconnectMercadoPago}
                disabled={disconnectMutation.isPending}
                variant="destructive"
                className="flex-1"
              >
                {disconnectMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Desconectando...
                  </>
                ) : (
                  'Desconectar'
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Pagos</CardTitle>
          <CardDescription>
            Detalles sobre cómo funcionan los pagos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium">Pagos seguros</p>
              <p className="text-sm text-muted-foreground">
                Mercado Pago procesa todos los pagos de forma segura
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium">Múltiples métodos de pago</p>
              <p className="text-sm text-muted-foreground">
                Tarjetas de crédito, débito, efectivo y más
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium">Acreditación rápida</p>
              <p className="text-sm text-muted-foreground">
                El dinero se acredita en tu cuenta según los plazos de Mercado Pago
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
