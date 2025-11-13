/**
 * @file checkout/page.tsx
 * @description Página de checkout para suscripción PRO
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle,
  Calendar,
  CreditCard,
  Users,
  BarChart3,
  Link as LinkIcon,
  Smartphone,
  Headphones,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      // TODO: Integrar con Mercado Pago
      // 1. Crear preferencia de suscripción
      // 2. Redirigir a checkout de Mercado Pago
      console.log('Iniciando suscripción...');
      
      // Por ahora, simulamos la redirección
      alert('Próximamente: Integración con Mercado Pago');
    } catch (error) {
      console.error('Error al suscribirse:', error);
      alert('Error al procesar la suscripción');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Suscripción Plan PRO</h1>
        <p className="text-muted-foreground mt-2">
          Activa tu suscripción y disfruta de todas las funcionalidades de Turns
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Plan PRO */}
        <Card className="md:col-span-2 border-2 border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl">Plan PRO</CardTitle>
                <CardDescription className="text-lg mt-2">
                  Todo lo que necesitas para hacer crecer tu negocio
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">$20,000</div>
                <div className="text-muted-foreground">/mes</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Características */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Turnos Ilimitados</p>
                  <p className="text-sm text-muted-foreground">
                    Gestiona todos los turnos que necesites
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Servicios Ilimitados</p>
                  <p className="text-sm text-muted-foreground">
                    Crea todos los servicios que ofreces
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Pagos con Mercado Pago</p>
                  <p className="text-sm text-muted-foreground">
                    Recibe pagos online automáticos
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <LinkIcon className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Link de Reserva</p>
                  <p className="text-sm text-muted-foreground">
                    Comparte tu link y recibe reservas 24/7
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Calendario Inteligente</p>
                  <p className="text-sm text-muted-foreground">
                    Vista diaria, semanal y mensual
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Gestión de Clientes</p>
                  <p className="text-sm text-muted-foreground">
                    Base de datos completa con historial
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <BarChart3 className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Reportes Avanzados</p>
                  <p className="text-sm text-muted-foreground">
                    Analiza ingresos y rendimiento
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Headphones className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Soporte Prioritario</p>
                  <p className="text-sm text-muted-foreground">
                    Asistencia rápida cuando la necesites
                  </p>
                </div>
              </div>
            </div>

            {/* Botón de Suscripción */}
            <div className="pt-4">
              <Button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    Pagar con Mercado Pago
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-3">
                Pago seguro procesado por Mercado Pago
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Información Adicional */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💳 Pago Seguro</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>Procesado por Mercado Pago, la plataforma de pagos más segura de Latinoamérica.</p>
              <p className="font-semibold text-foreground">Métodos aceptados:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Tarjetas de crédito</li>
                <li>Tarjetas de débito</li>
                <li>Mercado Pago</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🔄 Suscripción Mensual</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>Tu suscripción se renueva automáticamente cada mes.</p>
              <p>Puedes cancelar en cualquier momento desde tu panel de control.</p>
            </CardContent>
          </Card>

          <Alert>
            <AlertDescription className="text-sm">
              <p className="font-semibold mb-2">¿Necesitas ayuda?</p>
              <p>Contáctanos en support@turns.com o por WhatsApp al +54 9 11 1234-5678</p>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}

