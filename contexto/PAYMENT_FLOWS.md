# 💰 Flujos de Pago del Sistema

## 🎯 Visión General

El sistema maneja **dos flujos de pago diferentes** con Mercado Pago:

1. **Cliente → Profesional**: Clientes pagan por turnos/servicios
2. **Profesional → Plataforma**: Profesionales pagan por usar la plataforma

---

## 💳 FLUJO 1: Cliente → Profesional

### Objetivo

Permitir que los clientes paguen señas o el total de los servicios directamente al profesional.

### Cómo Funciona

#### Paso 1: Profesional Conecta su Cuenta de Mercado Pago

```
1. Profesional va a Dashboard → Configuración → Pagos
2. Click en "Conectar Mercado Pago"
3. OAuth de Mercado Pago (autorización segura)
4. Profesional autoriza que la plataforma procese pagos en su nombre
5. Credenciales guardadas de forma segura
```

#### Paso 2: Cliente Reserva y Paga

```
1. Cliente selecciona servicio y horario
2. Sistema calcula monto de seña (ej: 30% del total)
3. Cliente hace click en "Pagar Seña"
4. Checkout de Mercado Pago (modal o redirect)
5. Cliente paga con su método preferido
6. Pago procesado
```

#### Paso 3: Distribución del Dinero

```
Opción A: Pago Directo
├── 100% del pago va a la cuenta del profesional
└── Profesional paga suscripción mensual a la plataforma

Opción B: Split Payment (Recomendado)
├── X% va a la cuenta del profesional (ej: 95%)
├── Y% va a la plataforma como comisión (ej: 5%)
└── Todo automático en una sola transacción
```

### Implementación Técnica

#### Backend (NestJS)

```typescript
/**
 * Módulo de pagos para clientes
 */
@Module({
  imports: [MercadoPagoModule],
  providers: [CustomerPaymentService],
  controllers: [CustomerPaymentController],
})
export class CustomerPaymentModule {}

/**
 * Servicio para procesar pagos de clientes
 */
@Injectable()
export class CustomerPaymentService {
  constructor(
    private readonly mercadoPago: MercadoPagoService,
    private readonly businessRepository: BusinessRepository
  ) {}

  /**
   * Crea una preferencia de pago para un turno
   */
  async createAppointmentPayment(
    appointmentId: string,
    amount: number,
    businessId: string
  ): Promise<PaymentPreference> {
    // Obtener credenciales del profesional
    const business = await this.businessRepository.findById(businessId);
    const accessToken = business.mercadoPagoAccessToken;

    // Crear preferencia de pago
    const preference = await this.mercadoPago.createPreference({
      accessToken, // Token del profesional
      items: [
        {
          title: 'Seña de turno',
          quantity: 1,
          unit_price: amount,
        },
      ],
      back_urls: {
        success: `${process.env.WEB_URL}/pago/exito`,
        failure: `${process.env.WEB_URL}/pago/error`,
        pending: `${process.env.WEB_URL}/pago/pendiente`,
      },
      notification_url: `${process.env.API_URL}/webhooks/mercadopago`,
      // Split payment (opcional)
      marketplace_fee: amount * 0.05, // 5% para la plataforma
    });

    return preference;
  }

  /**
   * Webhook para recibir notificaciones de pago
   */
  async handlePaymentNotification(paymentId: string): Promise<void> {
    // Verificar estado del pago
    const payment = await this.mercadoPago.getPayment(paymentId);

    if (payment.status === 'approved') {
      // Marcar turno como pagado
      await this.appointmentRepository.markAsPaid(payment.external_reference);

      // Enviar notificaciones
      await this.notificationService.sendPaymentConfirmation(payment);
    }
  }
}
```

#### Endpoints

```typescript
// Crear pago para turno
POST /api/v1/payments/appointments/:appointmentId/create
Response: {
  preferenceId: string,
  initPoint: string, // URL para redirigir al checkout
  sandboxInitPoint: string
}

// Webhook de Mercado Pago
POST /api/v1/webhooks/mercadopago
Body: { type, data: { id } }

// Verificar estado de pago
GET /api/v1/payments/:paymentId/status
Response: {
  status: 'pending' | 'approved' | 'rejected',
  amount: number,
  paymentMethod: string
}

// Procesar reembolso
POST /api/v1/payments/:paymentId/refund
Body: { amount?: number } // Opcional: reembolso parcial
```

### Configuración en Admin Dashboard

```typescript
/**
 * Página de configuración de pagos
 * /dashboard/configuracion/pagos
 */
export default function PaymentsConfigPage() {
  return (
    <div>
      <h1>Configuración de Pagos</h1>

      {/* Conexión con Mercado Pago */}
      <Card>
        <CardHeader>
          <CardTitle>Mercado Pago</CardTitle>
          <CardDescription>
            Conecta tu cuenta para recibir pagos de tus clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isConnected ? (
            <>
              <Badge variant="success">Conectado</Badge>
              <p>Cuenta: {mercadoPagoEmail}</p>
              <Button variant="destructive" onClick={disconnect}>
                Desconectar
              </Button>
            </>
          ) : (
            <Button onClick={connectMercadoPago}>
              Conectar con Mercado Pago
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Configuración de señas */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Señas</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Porcentaje de seña por defecto</Label>
          <Input type="number" value={depositPercentage} />
          <p className="text-sm text-muted-foreground">
            Los clientes pagarán este porcentaje al reservar
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 💼 FLUJO 2: Profesional → Plataforma

### Objetivo

Monetizar la plataforma mediante suscripciones mensuales o comisiones por transacción.

### Modelo de Negocio Actual

#### Plan PRO Único (Implementado)

```
Plan PRO - $20,000 ARS/mes
├── 🎉 7 días de prueba gratis
├── Turnos ilimitados
├── Servicios ilimitados
├── Profesionales ilimitados (múltiples peluqueros/manicuristas)
├── Pagos online con Mercado Pago
├── Link de reserva personalizado
├── Calendario inteligente
├── Gestión de clientes
├── Reportes y estadísticas
└── Soporte prioritario

Características del Trial:
├── 7 días gratis desde el registro
├── Sin tarjeta de crédito requerida
├── Acceso completo a todas las funcionalidades
└── Al finalizar el trial: pagar o cuenta expira
```

#### Modelos Futuros (Opcional para v2.0+)

**Opción A: Múltiples Planes**

- Plan Básico ($X/mes): Hasta 50 turnos, 1 profesional
- Plan Pro ($Y/mes): Ilimitado, hasta 3 profesionales
- Plan Premium ($Z/mes): Todo ilimitado, múltiples sucursales

**Opción B: Comisión por Transacción**

- Sin costo mensual
- 5% de comisión por cada turno pagado
- Deducción automática con Split Payment

**Opción C: Modelo Híbrido**

- Suscripción + Comisión reducida
- $X/mes + 2% por turno

### Implementación Técnica

#### Backend (NestJS)

```typescript
/**
 * Módulo de suscripciones (Implementación Actual)
 */
@Module({
  imports: [PaymentsModule], // Importa MercadoPagoService
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}

/**
 * Servicio para gestionar suscripciones
 */
@Injectable()
export class SubscriptionsService {
  constructor(
    private prisma: PrismaService,
    private mercadoPagoService: MercadoPagoService,
    private configService: ConfigService
  ) {}

  /**
   * Obtener el plan Pro (único plan disponible)
   */
  async getPlans() {
    return this.prisma.subscriptionPlan.findMany({
      where: { name: 'Pro', isActive: true },
    });
  }

  /**
   * Obtener la suscripción actual de un negocio
   */
  async getCurrentSubscription(businessId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { businessId },
      include: { plan: true },
    });

    if (!subscription) {
      throw new NotFoundException(
        'No se encontró suscripción para este negocio'
      );
    }

    // Verificar si el trial expiró
    if (
      subscription.status === SubscriptionStatus.TRIAL &&
      subscription.trialEndsAt &&
      new Date() > subscription.trialEndsAt
    ) {
      // Actualizar estado a EXPIRED
      return this.prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: SubscriptionStatus.EXPIRED },
        include: { plan: true },
      });
    }

    return subscription;
  }

  /**
   * Crear preferencia de pago para activar suscripción después del trial
   */
  async createSubscriptionPaymentPreference(businessId: string) {
    const subscription = await this.getCurrentSubscription(businessId);

    // Obtener el plan Pro
    const plan = await this.prisma.subscriptionPlan.findFirst({
      where: { name: 'Pro' },
    });

    // Verificar que la suscripción esté en TRIAL o EXPIRED
    if (
      subscription.status !== SubscriptionStatus.TRIAL &&
      subscription.status !== SubscriptionStatus.EXPIRED
    ) {
      throw new BadRequestException(
        'Solo se puede pagar una suscripción en trial o expirada'
      );
    }

    // Obtener el negocio para usar su token de Mercado Pago
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    // Verificar que el negocio tenga Mercado Pago configurado
    if (!business.mercadopagoEnabled || !business.mercadopagoAccessToken) {
      throw new BadRequestException(
        'El negocio no tiene Mercado Pago configurado'
      );
    }

    // Crear preferencia de pago
    const preference = await this.mercadoPagoService.createPreference({
      accessToken: business.mercadopagoAccessToken,
      items: [
        {
          title: `Suscripción ${plan.name} - Turns`,
          quantity: 1,
          unit_price: plan.price,
          currency_id: plan.currency || 'ARS',
        },
      ],
      back_urls: {
        success: `${adminUrl}/dashboard/suscripcion?payment=success`,
        failure: `${adminUrl}/dashboard/suscripcion?payment=failure`,
        pending: `${adminUrl}/dashboard/suscripcion?payment=pending`,
      },
      notification_url: `${apiUrl}/api/v1/webhooks/mercadopago`,
      external_reference: `subscription-${businessId}-pro`,
    });

    return {
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
      planId: plan.id,
      planName: plan.name,
      price: plan.price,
      currency: plan.currency,
    };
  }

  /**
   * Activar suscripción después de pago exitoso
   */
  async activateSubscriptionAfterPayment(
    businessId: string,
    paymentId?: string
  ) {
    const subscription = await this.getCurrentSubscription(businessId);

    // Calcular próximo período (1 mes desde ahora)
    const now = new Date();
    const nextPeriodEnd = new Date(now);
    nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + 1);

    return this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: now,
        currentPeriodEnd: nextPeriodEnd,
        trialEndsAt: null,
        mercadopagoSubscriptionId: paymentId || null,
      },
      include: { plan: true },
    });
  }

  /**
   * Verificar si una suscripción está activa
   */
  async isSubscriptionActive(businessId: string): Promise<boolean> {
    try {
      const subscription = await this.getCurrentSubscription(businessId);
      return (
        subscription.status === SubscriptionStatus.ACTIVE ||
        subscription.status === SubscriptionStatus.TRIAL
      );
    } catch {
      return false;
    }
  }

  /**
   * Cancelar suscripción (se cancela al final del período)
   */
  async cancelSubscription(businessId: string) {
    const subscription = await this.getCurrentSubscription(businessId);

    return this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: SubscriptionStatus.CANCELLED,
        cancelAtPeriodEnd: true,
      },
      include: { plan: true },
    });
  }
}
```

#### Endpoints (Implementación Actual)

```typescript
// Obtener plan Pro (único plan disponible)
GET /api/v1/subscriptions/plans
Response: [{
  id: "uuid",
  name: "Pro",
  description: "Plan profesional con todas las funcionalidades - 7 días de prueba gratis",
  price: 20000,
  currency: "ARS",
  interval: "month",
  features: {
    maxServices: -1, // Ilimitado
    maxAppointmentsPerMonth: -1, // Ilimitado
    analytics: true,
    customBranding: true,
    prioritySupport: true,
    multipleLocations: true,
    trialDays: 7
  },
  isActive: true
}]

// Obtener suscripción actual del negocio
GET /api/v1/subscriptions/current
Response: {
  id: "uuid",
  businessId: "uuid",
  plan: {
    id: "uuid",
    name: "Pro",
    price: 20000,
    currency: "ARS",
    // ... resto de campos del plan
  },
  status: "TRIAL" | "ACTIVE" | "CANCELLED" | "EXPIRED",
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  trialEndsAt: Date | null, // Solo si status = TRIAL
  cancelAtPeriodEnd: boolean,
  mercadopagoSubscriptionId: string | null
}

// Crear preferencia de pago para activar suscripción después del trial
POST /api/v1/subscriptions/payment-preference
Response: {
  preferenceId: string,
  initPoint: string, // URL para producción
  sandboxInitPoint: string, // URL para sandbox
  planId: string,
  planName: "Pro",
  price: 20000,
  currency: "ARS"
}

// Activar suscripción después de pago exitoso
POST /api/v1/subscriptions/activate-after-payment
Body: {
  paymentId?: string // Opcional, ID del pago de Mercado Pago
}
Response: {
  id: "uuid",
  status: "ACTIVE",
  currentPeriodStart: Date,
  currentPeriodEnd: Date, // +1 mes desde ahora
  plan: { ... }
}

// Cancelar suscripción (termina al final del período)
POST /api/v1/subscriptions/cancel
Response: {
  id: "uuid",
  status: "CANCELLED",
  cancelAtPeriodEnd: true,
  currentPeriodEnd: Date // Sigue activa hasta esta fecha
}

// Reactivar suscripción cancelada
POST /api/v1/subscriptions/reactivate
Response: {
  id: "uuid",
  status: "ACTIVE",
  cancelAtPeriodEnd: false
}

// Webhook de Mercado Pago (pagos de suscripciones)
POST /api/v1/webhooks/mercadopago
Body: { type, data: { id } }

// Notas importantes:
// 1. Al registrarse como profesional, se crea automáticamente una suscripción
//    con status: 'TRIAL' y trialEndsAt: +7 días desde el registro
// 2. Durante el trial, el profesional tiene acceso completo sin pagar
// 3. Al finalizar el trial, debe pagar para activar la suscripción
// 4. El pago se hace mediante Mercado Pago usando las credenciales del negocio
// 5. Solo existe 1 plan (Pro), no hay opción de cambiar de plan
```

### Página de Suscripción

```typescript
/**
 * Página de suscripción
 * /dashboard/suscripcion
 */
export default function SubscriptionPage() {
  const { subscription, isLoading } = useSubscription();

  return (
    <div>
      <h1>Mi Suscripción</h1>

      {/* Plan actual */}
      <Card>
        <CardHeader>
          <CardTitle>Plan {subscription.plan.name}</CardTitle>
          <Badge
            variant={
              subscription.status === "active" ? "success" : "destructive"
            }
          >
            {subscription.status}
          </Badge>
        </CardHeader>
        <CardContent>
          <p>Precio: ${subscription.plan.price}/mes</p>
          <p>Próximo cobro: {subscription.nextBillingDate}</p>
          <p>Días restantes: {subscription.daysUntilRenewal}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={changePlan}>
            Cambiar Plan
          </Button>
          <Button variant="destructive" onClick={cancelSubscription}>
            Cancelar Suscripción
          </Button>
        </CardFooter>
      </Card>

      {/* Historial de pagos */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Factura</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>${payment.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        payment.status === "paid" ? "success" : "destructive"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => downloadInvoice(payment.id)}
                    >
                      Descargar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Planes disponibles */}
      <div className="grid grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <p className="text-3xl font-bold">${plan.price}/mes</p>
            </CardHeader>
            <CardContent>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>✓ {feature}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => selectPlan(plan.id)}
                disabled={subscription.planId === plan.id}
              >
                {subscription.planId === plan.id
                  ? "Plan Actual"
                  : "Seleccionar"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## 🔒 Seguridad

### Credenciales de Mercado Pago

```typescript
/**
 * Almacenamiento seguro de credenciales
 */
interface BusinessMercadoPagoCredentials {
  businessId: string;
  accessToken: string; // Encriptado en BD
  refreshToken: string; // Encriptado en BD
  publicKey: string;
  expiresAt: Date;
  scope: string[];
  connectedAt: Date;
}

// Encriptar antes de guardar
const encryptedToken = await this.encryption.encrypt(accessToken);

// Desencriptar al usar
const decryptedToken = await this.encryption.decrypt(encryptedToken);
```

### Validación de Webhooks

```typescript
/**
 * Validar que el webhook viene realmente de Mercado Pago
 */
async validateWebhook(signature: string, payload: any): Promise<boolean> {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return signature === expectedSignature;
}
```

---

## 📊 Reportes y Comisiones

### Dashboard de Ingresos (Profesional)

```typescript
/**
 * Vista de ingresos para el profesional
 */
interface ProfessionalEarningsReport {
  totalEarnings: number; // Total recibido de clientes
  platformFees: number; // Comisiones pagadas a la plataforma
  netEarnings: number; // Ganancia neta
  subscriptionCost: number; // Costo de suscripción mensual
  transactionCount: number; // Cantidad de transacciones
  averageTicket: number; // Ticket promedio
}
```

### Dashboard de Ingresos (Plataforma)

```typescript
/**
 * Vista de ingresos para la plataforma
 */
interface PlatformRevenueReport {
  subscriptionRevenue: number; // Ingresos por suscripciones
  commissionRevenue: number; // Ingresos por comisiones
  totalRevenue: number; // Total
  activeSubscriptions: number; // Suscripciones activas
  churnRate: number; // Tasa de cancelación
  mrr: number; // Monthly Recurring Revenue
}
```

---

## ✅ Checklist de Implementación

### Flujo Cliente → Profesional

- [ ] OAuth de Mercado Pago para profesionales
- [ ] Crear preferencias de pago
- [ ] Checkout de Mercado Pago
- [ ] Webhook para notificaciones
- [ ] Split payment (opcional)
- [ ] Reembolsos
- [ ] Dashboard de pagos recibidos

### Flujo Profesional → Plataforma

- [ ] Definir planes de suscripción
- [ ] Crear planes en Mercado Pago
- [ ] Sistema de suscripciones
- [ ] Webhook para notificaciones de suscripción
- [ ] Página de gestión de suscripción
- [ ] Período de prueba gratuito
- [ ] Facturación automática
- [ ] Cancelación de suscripción

---

_Documento creado: 2025-11-06_
_Versión: 1.0_
