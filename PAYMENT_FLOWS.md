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
          title: "Seña de turno",
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

    if (payment.status === "approved") {
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

### Modelos de Negocio

#### Opción A: Suscripción Mensual

```
Plan Básico - $X/mes
├── Hasta 50 turnos/mes
├── 1 profesional
├── Funcionalidades básicas
└── Soporte por email

Plan Pro - $Y/mes
├── Turnos ilimitados
├── Hasta 3 profesionales
├── Todas las funcionalidades
├── Reportes avanzados
└── Soporte prioritario

Plan Premium - $Z/mes
├── Todo ilimitado
├── Múltiples sucursales
├── API access
├── White label (opcional)
└── Soporte 24/7
```

#### Opción B: Comisión por Transacción

```
Sin costo mensual
├── 5% de comisión por cada turno pagado
├── Deducción automática con Split Payment
└── Todas las funcionalidades incluidas
```

#### Opción C: Modelo Híbrido (Recomendado)

```
Suscripción Básica + Comisión Reducida
├── $X/mes de suscripción
├── 2% de comisión por turno (en lugar de 5%)
└── Mejor para ambas partes
```

### Implementación Técnica

#### Backend (NestJS)

```typescript
/**
 * Módulo de suscripciones
 */
@Module({
  imports: [MercadoPagoModule, SubscriptionModule],
  providers: [PlatformPaymentService],
  controllers: [PlatformPaymentController],
})
export class PlatformPaymentModule {}

/**
 * Servicio para gestionar suscripciones
 */
@Injectable()
export class PlatformPaymentService {
  constructor(
    private readonly mercadoPago: MercadoPagoService,
    private readonly subscriptionRepository: SubscriptionRepository
  ) {}

  /**
   * Crea una suscripción para un profesional
   */
  async createSubscription(
    businessId: string,
    planId: string,
    paymentMethodId: string
  ): Promise<Subscription> {
    // Obtener detalles del plan
    const plan = await this.getSubscriptionPlan(planId);

    // Crear suscripción en Mercado Pago
    const subscription = await this.mercadoPago.createSubscription({
      preapproval_plan_id: plan.mercadoPagoPlanId,
      payer_email: business.email,
      card_token_id: paymentMethodId,
      back_url: `${process.env.ADMIN_URL}/suscripcion/exito`,
      status: "authorized",
    });

    // Guardar suscripción en BD
    await this.subscriptionRepository.create({
      businessId,
      planId,
      mercadoPagoSubscriptionId: subscription.id,
      status: "active",
      startDate: new Date(),
      nextBillingDate: this.calculateNextBilling(plan.billingCycle),
    });

    return subscription;
  }

  /**
   * Webhook para notificaciones de suscripción
   */
  async handleSubscriptionNotification(
    subscriptionId: string,
    action: string
  ): Promise<void> {
    switch (action) {
      case "payment.created":
        // Pago exitoso
        await this.subscriptionRepository.updateStatus(
          subscriptionId,
          "active"
        );
        break;

      case "payment.failed":
        // Pago fallido
        await this.subscriptionRepository.updateStatus(
          subscriptionId,
          "payment_failed"
        );
        // Enviar notificación al profesional
        await this.notificationService.sendPaymentFailedAlert(subscriptionId);
        break;

      case "subscription.cancelled":
        // Suscripción cancelada
        await this.subscriptionRepository.updateStatus(
          subscriptionId,
          "cancelled"
        );
        break;
    }
  }

  /**
   * Verifica si un negocio tiene suscripción activa
   */
  async hasActiveSubscription(businessId: string): Promise<boolean> {
    const subscription = await this.subscriptionRepository.findActiveByBusiness(
      businessId
    );
    return subscription !== null && subscription.status === "active";
  }
}
```

#### Endpoints

```typescript
// Obtener planes disponibles
GET /api/v1/subscriptions/plans
Response: {
  plans: [
    {
      id: string,
      name: string,
      price: number,
      features: string[],
      billingCycle: 'monthly' | 'yearly'
    }
  ]
}

// Crear suscripción
POST /api/v1/subscriptions
Body: {
  planId: string,
  paymentMethodId: string
}
Response: {
  subscriptionId: string,
  status: 'active',
  nextBillingDate: Date
}

// Obtener suscripción actual
GET /api/v1/subscriptions/current
Response: {
  plan: { name, price, features },
  status: 'active' | 'cancelled' | 'payment_failed',
  nextBillingDate: Date,
  daysUntilRenewal: number
}

// Cancelar suscripción
DELETE /api/v1/subscriptions/current
Response: {
  message: 'Subscription cancelled',
  validUntil: Date
}

// Cambiar plan
PUT /api/v1/subscriptions/change-plan
Body: { newPlanId: string }

// Webhook de Mercado Pago (suscripciones)
POST /api/v1/webhooks/mercadopago/subscriptions
Body: { type, data: { id } }
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
