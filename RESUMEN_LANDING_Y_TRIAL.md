# Resumen: Landing Page y Trial de 7 Días

## ✅ Implementación Completada

Se ha creado una **Landing Page** profesional y se ha agregado el sistema de **Trial de 7 días** al proyecto.

---

## 🆕 Nueva App: Landing Page

### Ubicación

```
apps/landing/
```

### Características

#### 📄 Página Principal (`http://localhost:3003`)

**Secciones**:

1. **Header**
   - Logo de Turns
   - Links: Características, Precios
   - Botones: "Iniciar Sesión", "Comenzar Gratis"

2. **Hero Section**
   - Título principal: "Gestiona tu Negocio de Belleza de Forma Simple"
   - Subtítulo con propuesta de valor
   - CTA destacado: "Comenzar Gratis - 7 Días"
   - Badge: "Sin tarjeta de crédito • 7 días gratis • Cancela cuando quieras"

3. **Características** (6 tarjetas)
   - 📅 Calendario Inteligente
   - 💳 Pagos Automáticos
   - 👥 Gestión de Clientes
   - 🔗 Link de Reserva
   - 📊 Reportes y Estadísticas
   - 📱 100% Responsive

4. **Plan y Precio** (1 plan único)
   - **PRO**: $20,000/mes (todo ilimitado, pagos online, reportes, soporte) ⭐ Plan Profesional

5. **CTA Final**
   - Fondo azul llamativo
   - "¿Listo para Transformar tu Negocio?"
   - Botón grande: "Comenzar Gratis - 7 Días"

6. **Footer**
   - Logo y descripción
   - Links: Producto, Empresa, Legal
   - Copyright

---

## 🗄️ Base de Datos: Suscripciones

### Nuevos Modelos en Prisma

#### 1. **SubscriptionStatus** (Enum)

```prisma
enum SubscriptionStatus {
  TRIAL      // Período de prueba (7 días)
  ACTIVE     // Activa y pagando
  CANCELLED  // Cancelada (sigue activa hasta fin de período)
  EXPIRED    // Expirada (sin pago)
}
```

#### 2. **SubscriptionPlan** (Model)

```prisma
model SubscriptionPlan {
  id          String
  name        String  // "Free", "Basic", "Pro"
  slug        String  // "free", "basic", "pro"
  description String?
  price       Float   // Precio mensual en ARS
  interval    String  // "month", "year"
  features    Json    // Límites y características
  isActive    Boolean
  createdAt   DateTime
  updatedAt   DateTime
}
```

**Plan único**:

- **PRO**: $20,000/mes, todo ilimitado, pagos online, reportes, soporte prioritario

#### 3. **Subscription** (Model)

```prisma
model Subscription {
  id                        String
  businessId                String  @unique
  planId                    String
  status                    SubscriptionStatus  // TRIAL, ACTIVE, etc.
  currentPeriodStart        DateTime
  currentPeriodEnd          DateTime
  trialEndsAt               DateTime?  // 7 días desde registro
  cancelAtPeriodEnd         Boolean
  cancelledAt               DateTime?
  mercadopagoSubscriptionId String?
  createdAt                 DateTime
  updatedAt                 DateTime
}
```

---

## 🎯 Flujo Completo del Profesional

### 1. Landing Page

```
http://localhost:3003  (o https://turns.com en producción)
```

- El profesional ve la landing page
- Lee características y precios
- Click en "Comenzar Gratis - 7 Días"

### 2. Registro

```
http://localhost:3002/register
```

- Completa formulario de registro
- Al registrarse:
  - ✅ Se crea usuario con rol `PROFESSIONAL`
  - ✅ Se crea negocio asociado
  - ✅ Se crea suscripción con estado `TRIAL`
  - ✅ `trialEndsAt` = fecha actual + 7 días
  - ✅ Redirige a `/dashboard`

### 3. Dashboard con Trial

```
http://localhost:3002/dashboard
```

- Banner superior muestra:
  ```
  ⏰ Te quedan X días de prueba gratis
  [Ver Planes] [Suscribirme Ahora]
  ```
- Puede usar todas las funcionalidades durante 7 días

### 4. Fin del Trial (Día 8)

- Banner cambia a:
  ```
  ⚠️ Tu período de prueba ha terminado
  [Suscribirte para continuar]
  ```
- El sistema bloquea ciertas funcionalidades
- Debe suscribirse para continuar

### 5. Suscripción

```
http://localhost:3002/suscripcion/planes
```

- Ve los 3 planes disponibles
- Elige un plan
- Paga con Mercado Pago
- ✅ Suscripción activada

---

## 📁 Archivos Creados

### Landing Page

```
apps/landing/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Landing page
│   └── globals.css         # Estilos globales
├── package.json            # Dependencias
├── tsconfig.json           # Config TypeScript
├── tailwind.config.ts      # Config Tailwind
├── next.config.js          # Config Next.js
├── postcss.config.js       # Config PostCSS
└── .eslintrc.json          # Config ESLint
```

### Base de Datos

```
apps/backend/prisma/
└── schema.prisma           # ✏️ Actualizado con modelos de suscripción
```

---

## 🚀 Próximos Pasos

### 1. **Instalar Dependencias de Landing**

```bash
cd apps/landing
pnpm install
```

### 2. **Migrar Base de Datos**

```bash
cd apps/backend
pnpm prisma migrate dev --name add-subscriptions
```

### 3. **Crear Seeds de Planes**

```bash
# Crear archivo de seeds para los planes
cd apps/backend
# Ejecutar seeds
pnpm prisma db seed
```

### 4. **Actualizar Servicio de Auth**

```typescript
// apps/backend/src/auth/auth.service.ts
async register(dto: RegisterDto) {
  // ... crear usuario y negocio ...

  // Crear suscripción con trial de 7 días
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 7);

  await this.prisma.subscription.create({
    data: {
      businessId: business.id,
      planId: freePlan.id, // Plan Free por defecto
      status: 'TRIAL',
      currentPeriodStart: new Date(),
      currentPeriodEnd: trialEndsAt,
      trialEndsAt,
    },
  });
}
```

### 5. **Crear Middleware de Verificación**

```typescript
// apps/backend/src/common/guards/subscription.guard.ts
@Injectable()
export class SubscriptionGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = context.switchToHttp().getRequest().user;
    const subscription = await this.prisma.subscription.findUnique({
      where: { businessId: user.businessId },
    });

    // Verificar si está en trial y no ha expirado
    if (subscription.status === 'TRIAL') {
      if (new Date() > subscription.trialEndsAt) {
        throw new ForbiddenException('Trial period expired');
      }
      return true;
    }

    // Verificar si tiene suscripción activa
    if (subscription.status === 'ACTIVE') {
      return true;
    }

    throw new ForbiddenException('No active subscription');
  }
}
```

### 6. **Crear Banner de Trial en Dashboard**

```typescript
// apps/admin-dashboard/src/components/dashboard/trial-banner.tsx
export function TrialBanner({ subscription }) {
  const daysLeft = Math.ceil(
    (subscription.trialEndsAt - new Date()) / (1000 * 60 * 60 * 24)
  );

  if (subscription.status === 'TRIAL') {
    return (
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        ⏰ Te quedan {daysLeft} días de prueba gratis
        <Link href="/suscripcion/planes">Ver Planes</Link>
      </div>
    );
  }

  if (subscription.status === 'EXPIRED') {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        ⚠️ Tu período de prueba ha terminado
        <Link href="/suscripcion/planes">Suscribirte Ahora</Link>
      </div>
    );
  }

  return null;
}
```

---

## 🌐 Deployment en Vercel

### Landing Page (Gratis)

1. **Conectar Repositorio**
   - Ir a [vercel.com](https://vercel.com)
   - Click "New Project"
   - Importar desde GitHub

2. **Configurar Proyecto**
   - Root Directory: `apps/landing`
   - Framework: Next.js
   - Build Command: `pnpm build`
   - Output Directory: `.next`

3. **Variables de Entorno**

   ```
   NEXT_PUBLIC_ADMIN_URL=https://admin.turns.com
   NEXT_PUBLIC_WEB_CLIENT_URL=https://app.turns.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel asigna URL automática: `landing-xxx.vercel.app`
   - Configurar dominio personalizado (opcional): `turns.com`

### URLs Finales

- Landing: `https://turns.com` (Vercel - Gratis)
- Admin: `https://admin.turns.com` (Vercel - Gratis)
- Web Client: `https://app.turns.com` (Vercel - Gratis)
- Backend: `https://api.turns.com` (Railway/Render - Pago)

---

## 💰 Plan de Suscripción

| Característica          | Plan PRO         |
| ----------------------- | ---------------- |
| **Precio**              | $20,000/mes      |
| **Turnos**              | ∞ Ilimitados     |
| **Servicios**           | ∞ Ilimitados     |
| **Pagos Online**        | ✅ Mercado Pago  |
| **Link de Reserva**     | ✅ Personalizado |
| **Calendario**          | ✅ Inteligente   |
| **Gestión de Clientes** | ✅ Completa      |
| **Reportes**            | ✅ Avanzados     |
| **Soporte**             | ✅ Prioritario   |

**Trial**: 7 días gratis (sin tarjeta de crédito)

---

## ✅ Checklist de Implementación

### Landing Page

- [x] Crear app Next.js
- [x] Diseñar Hero Section
- [x] Sección de Características
- [x] Sección de Precios
- [x] CTA y Footer
- [ ] Instalar dependencias
- [ ] Probar localmente
- [ ] Deploy en Vercel

### Base de Datos

- [x] Agregar modelos de suscripción
- [ ] Crear migración
- [ ] Crear seeds de planes
- [ ] Ejecutar migración

### Backend

- [ ] Actualizar servicio de registro
- [ ] Crear guard de suscripción
- [ ] Crear módulo de suscripciones
- [ ] Endpoints de suscripción

### Frontend

- [ ] Banner de trial en dashboard
- [ ] Página de planes
- [ ] Página de pago
- [ ] Integración con Mercado Pago

---

**Fecha de Implementación**: 13 de Noviembre, 2025  
**Estado**: Landing Page creada, Schema actualizado  
**Próximo**: Migrar BD y actualizar registro con trial de 7 días
