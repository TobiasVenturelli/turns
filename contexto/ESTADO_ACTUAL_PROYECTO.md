# 📊 Estado Actual del Proyecto - Turns

**Última actualización**: 18 de Noviembre, 2025  
**Versión**: 1.0.0 (MVP)

---

## 🚀 Despliegues en Producción

### Frontend (Vercel)

✅ **Landing Page**: Desplegada

- URL: `https://turns-landing.vercel.app` (pendiente confirmar)
- Estado: Funcional

✅ **Admin Dashboard**: Desplegado

- URL: `https://turns-admin-dashboard.vercel.app` (pendiente confirmar)
- Estado: Funcional
- Variables de entorno configuradas
- WebSockets integrados ✅

✅ **Web Client**: Desplegado

- URL: `https://turns-web-client.vercel.app` (pendiente confirmar)
- Estado: Funcional
- Variables de entorno configuradas

### Backend (Render)

✅ **API Backend**: Desplegado

- URL: `https://turns-backend.onrender.com`
- Base de datos: PostgreSQL (Render)
- Estado: ✅ Funcional
- Health check: `https://turns-backend.onrender.com/api/v1` → `{"status":"ok"}`
- Migraciones: ✅ Aplicadas
- Seed: ✅ Ejecutado

### Monitoreo

✅ **UptimeRobot**: Configurado

- Mantiene el backend activo (plan gratuito de Render)
- Ping cada 5 minutos

---

## 💳 Sistema de Suscripciones

### Implementación Actual

✅ **Plan Único: Pro**

- Precio: $20,000 ARS/mes
- Trial: 7 días gratis (sin tarjeta de crédito)
- Características: Todo incluido (ilimitado)

✅ **Estados de Suscripción**:

- `TRIAL`: Período de prueba de 7 días (automático al registrarse)
- `ACTIVE`: Suscripción activa pagando mensualmente
- `CANCELLED`: Cancelada (termina al final del período)
- `EXPIRED`: Trial o suscripción expirada (cuenta inactiva)

✅ **Flujo Implementado**:

1. Profesional se registra → Se crea automáticamente trial de 7 días
2. Durante trial → Acceso completo sin pagar
3. Al finalizar trial → Debe pagar para continuar
4. Pago con Mercado Pago → Suscripción se activa por 1 mes
5. Renovación mensual automática

✅ **Backend**:

- Módulo de suscripciones completado
- Integración con Mercado Pago
- Guard para verificar suscripción activa
- Endpoints REST funcionales

✅ **Frontend (Admin Dashboard)**:

- Página de estado de suscripción (`/suscripcion`)
- Página de plan Pro (`/suscripcion/planes`)
- Integración con Mercado Pago para pagos
- Manejo de callbacks de pago (success, failure, pending)

---

## 🔌 WebSockets en Tiempo Real

✅ **COMPLETAMENTE IMPLEMENTADO**:

**Backend**:

- Socket.io configurado en backend
- Gateway y service funcionales
- Eventos de turnos en tiempo real
- Eventos de pagos en tiempo real
- Salas por negocio y por usuario

**Admin Dashboard** ✅:

- Hook `useSocket` completamente funcional
- Escucha eventos en tiempo real:
  - `appointment:created` - Nuevo turno creado
  - `appointment:updated` - Turno actualizado
  - `appointment:cancelled` - Turno cancelado
  - `payment:confirmed` - Pago confirmado
  - `payment:refunded` - Pago reembolsado
- Dashboard actualiza estadísticas automáticamente
- Calendario actualiza turnos en tiempo real
- Notificaciones toast al recibir eventos

**Web Client**: ⏳ Pendiente integración (opcional)

---

## 💰 Sistema de Pagos

### Cliente → Profesional

✅ **Mercado Pago OAuth**:

- Profesional conecta su cuenta
- Pagos van directo a su cuenta
- Señas y pagos completos
- Webhooks básicos configurados

⚠️ **Webhooks**: Funcional básico, necesita mejoras (ver Pendientes)

### Profesional → Plataforma

✅ **Suscripciones con Mercado Pago**:

- Plan Pro único
- Pago mensual recurrente
- Trial de 7 días sin tarjeta
- Webhooks para renovaciones (pendiente mejorar)

---

## 🗄️ Base de Datos

### Esquema Actual

✅ **Modelos Principales**:

- `User` - Usuarios (clientes y profesionales)
- `Business` - Negocios de profesionales
- `Service` - Servicios ofrecidos
- `Schedule` - Horarios de atención
- `Appointment` - Turnos/citas
- `SubscriptionPlan` - Plan Pro (único plan)
- `Subscription` - Suscripciones de negocios

❌ **Modelos Pendientes**:

- `Professional` - Múltiples profesionales por negocio (NO IMPLEMENTADO)
- `ProfessionalSchedule` - Horarios por profesional (NO IMPLEMENTADO)

✅ **Migración**:

- Versión: `20251114214647_init`
- Estado: Aplicada en local y producción
- Seed ejecutado: ✅

### Datos de Prueba (Local)

```
Usuario Cliente:
- Email: cliente@test.com
- Password: Password123!

Usuario Profesional:
- Email: profesional@test.com
- Password: Password123!
- Negocio: Peluquería María (slug: peluqueria-maria)
- Suscripción: TRIAL (7 días)
- Servicios: Corte de Pelo, Coloración, Manicura, Pedicura
```

---

## ✅ Funcionalidades Completadas

### FASE 1-3: Backend Base ✅

- Autenticación JWT
- OAuth con Google
- CRUD de negocios, servicios, horarios
- CRUD de turnos
- Sistema de roles (Customer/Professional)

### FASE 4: Pagos y Suscripciones ✅

- Integración con Mercado Pago (cliente → profesional)
- Sistema de suscripciones (profesional → plataforma)
- Plan Pro con trial de 7 días
- Webhooks básicos de pagos

### FASE 5: WebSockets ✅

- Actualizaciones en tiempo real
- Eventos de turnos y pagos
- Salas por negocio y usuario
- Integración completa en Admin Dashboard

### FASE 6: Deployment ✅

- Backend en Render
- Frontends en Vercel
- Base de datos PostgreSQL en Render
- Variables de entorno configuradas
- UptimeRobot configurado

### FASE 7: UI/UX Básico ✅

- Admin Dashboard con todas las páginas principales
- Web Client con flujo de reserva completo
- Gestión básica de clientes
- Reportes básicos con gráficos (Recharts)
- Calendario de turnos (FullCalendar)

---

## 🚧 Pendientes de Implementación

### 🔴 PRIORIDAD ALTA - Implementar Próximamente

#### 1. Sistema de Múltiples Profesionales ⭐⭐⭐

**Estado**: ❌ NO IMPLEMENTADO  
**Impacto**: ALTO  
**Tiempo estimado**: 11-14 horas

**Qué falta**:

- Modelo `Professional` en Prisma
- Modelo `ProfessionalSchedule` en Prisma
- Módulo `professionals` en backend (CRUD completo)
- Página `/dashboard/profesionales` en admin
- Selección de profesional en flujo de reserva (web-client)
- Filtros y vistas por profesional en calendario

**Referencia**: Ver `WORKFLOW_V2.md` para detalles completos

---

#### 2. Completar Sistema de Notificaciones por Email ⭐⭐

**Estado**: ⚠️ INFRAESTRUCTURA LISTA, FALTA INTEGRACIÓN  
**Impacto**: ALTO (reduce no-shows)  
**Tiempo estimado**: 4-6 horas

**Qué está**:

- ✅ Módulo `notifications` en backend
- ✅ Servicio `NotificationsService` con métodos
- ✅ Templates HTML para emails

**Qué falta**:

- Configurar proveedor de email (Resend/SendGrid)
- Integrar envío automático en flujos de turnos
- Implementar recordatorios automáticos (cron jobs)
- Tests de envío de emails

---

#### 3. Mejorar Webhooks de Mercado Pago ⭐⭐

**Estado**: ⚠️ BÁSICO FUNCIONAL, FALTA MEJORAR  
**Impacto**: ALTO (crítico para pagos automáticos)  
**Tiempo estimado**: 3-4 horas

**Qué está**:

- ✅ Endpoint `/api/v1/webhooks/mercadopago`
- ✅ Procesa pagos de turnos

**Qué falta**:

- Validación de firma robusta (seguridad)
- Webhooks de suscripciones (renovaciones, cancelaciones)
- Retry logic para webhooks fallidos
- Logging y auditoría mejorados
- Idempotencia

---

### 🟡 PRIORIDAD MEDIA - Implementar Después

#### 4. Gestión Completa de Clientes ⭐

**Estado**: ⚠️ BÁSICO IMPLEMENTADO  
**Tiempo estimado**: 6-8 horas

**Qué está**:

- ✅ Página `/dashboard/clientes`
- ✅ Lista de clientes
- ✅ Información básica

**Qué falta**:

- Historial detallado por cliente
- Notas del profesional
- Preferencias y alergias
- Fotos de trabajos anteriores
- Estadísticas por cliente (lifetime value, frecuencia)
- Segmentación (nuevos, frecuentes, inactivos, VIP)
- Exportar lista (CSV/Excel)
- Comunicación directa (email, WhatsApp, llamar)

---

#### 5. Reportes y Estadísticas Avanzadas ⭐

**Estado**: ⚠️ BÁSICO IMPLEMENTADO  
**Tiempo estimado**: 8-10 horas

**Qué está**:

- ✅ Página `/dashboard/reportes`
- ✅ Gráficos básicos (Recharts)
- ✅ Estadísticas del dashboard

**Qué falta**:

- Reportes por profesional
- Datos reales (no mock) de ingresos históricos
- Exportar reportes (PDF, Excel, CSV)
- Filtros avanzados por fecha
- Métricas calculadas (tasa de ocupación, cancelación, no-show)
- Proyecciones de ingresos
- Reportes de clientes (retención, nuevos, etc.)

---

### 🟢 PRIORIDAD BAJA - Futuro

#### 6. Integración con Calendarios

**Tiempo estimado**: 4-6 horas

- Google Calendar API
- Exportar a iCal
- Botón "Agregar a mi calendario"

#### 7. Multi-idioma (Solo Inglés)

**Tiempo estimado**: 8-10 horas

- Configurar i18n (next-intl)
- Traducir a inglés
- Selector de idioma

#### 8. App Móvil Nativa

**Tiempo estimado**: 40-60 horas

- React Native + Expo
- **Para mucho más adelante**

---

## ❌ Funcionalidades Descartadas (No se implementarán)

Las siguientes funcionalidades NO son prioridad para el MVP:

- ❌ Sistema de promociones y descuentos
- ❌ Valoraciones y reseñas
- ❌ QR Codes y kit de marketing
- ❌ Tracking y analíticas de links
- ❌ Programa de fidelidad
- ❌ Chat en tiempo real

**Razón**: No son críticas para el funcionamiento del MVP. Se pueden considerar en versiones futuras si hay demanda

---

## 📊 Resumen de Tiempos Estimados

### 🔴 Prioridad Alta: ~18-24 horas

1. Múltiples profesionales: 11-14h
2. Notificaciones por email: 4-6h
3. Webhooks Mercado Pago: 3-4h

### 🟡 Prioridad Media: ~14-18 horas

4. Gestión completa de clientes: 6-8h
5. Reportes avanzados: 8-10h

### 🟢 Prioridad Baja: ~52-76 horas

6. Integración calendarios: 4-6h
7. Multi-idioma: 8-10h
8. App móvil: 40-60h (mucho más adelante)

**Total para completar prioridades altas y medias**: ~32-42 horas

---

## 🎯 Orden de Implementación Recomendado

1. **Notificaciones por Email** (4-6h) → Impacto inmediato, reduce no-shows
2. **Webhooks Mercado Pago** (3-4h) → Crítico para pagos confiables
3. **Múltiples Profesionales** (11-14h) → Funcionalidad más grande, desbloquea casos de uso
4. **Gestión de Clientes** (6-8h) → Mejora experiencia del profesional
5. **Reportes Avanzados** (8-10h) → Ayuda en decisiones de negocio

---

## 🛠️ Stack Tecnológico

### Frontend

- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS + Shadcn/ui
- **Estado**: Zustand + TanStack Query
- **Formularios**: React Hook Form + Zod
- **Gráficos**: Recharts
- **Calendario**: FullCalendar
- **Testing**: Vitest + Playwright

### Backend

- **Framework**: NestJS
- **Base de datos**: PostgreSQL + Prisma ORM
- **Autenticación**: JWT + Passport + Google OAuth
- **Pagos**: Mercado Pago SDK
- **WebSockets**: Socket.io
- **Testing**: Jest

### DevOps

- **Monorepo**: Turborepo + pnpm
- **CI/CD**: GitHub Actions (pendiente)
- **Hosting Frontend**: Vercel
- **Hosting Backend**: Render
- **Monitoreo**: UptimeRobot

---

## 🔗 URLs Importantes

### Producción

- Backend API: `https://turns-backend.onrender.com/api/v1`
- Health Check: `https://turns-backend.onrender.com/api/v1`

### Local Development

- Backend: `http://localhost:3000`
- Web Client: `http://localhost:3001`
- Admin Dashboard: `http://localhost:3002`
- Landing: `http://localhost:3003`

### Servicios Externos

- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard
- UptimeRobot: https://uptimerobot.com
- Mercado Pago Developers: https://www.mercadopago.com.ar/developers

---

## 📝 Documentación Disponible

- `DEVELOPMENT_RULES.md` - Reglas y estándares de desarrollo
- `WORKFLOW_V2.md` - Flujo de desarrollo y sistema de profesionales
- `PAYMENT_FLOWS.md` - Flujos de pago detallados
- `FEATURES.md` - Funcionalidades del sistema (actualizar)
- Este archivo - Estado actual y pendientes

---

_Este documento se actualiza regularmente a medida que el proyecto evoluciona._
