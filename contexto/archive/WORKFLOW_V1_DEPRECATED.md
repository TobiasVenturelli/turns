# 🚀 Workflow de Desarrollo - Versión 1.0 (MVP)

## 🎯 Objetivo General

Crear un sistema funcional de gestión de turnos con:

1. **Página web completa** (cliente + admin) - PRIORIDAD
2. **App móvil** (cliente) - Fase posterior

---

## 📋 Estrategia de Desarrollo

### Principios:

- ✅ **Desarrollo incremental**: Cada fase produce algo funcional
- ✅ **Testing continuo**: Probar cada funcionalidad antes de avanzar
- ✅ **Prioridad web**: Primero web perfecta, luego mobile
- ✅ **MVP funcional**: Solo funcionalidades esenciales en v1.0
- ✅ **Resúmenes por fase**: Ver regla en [DEVELOPMENT_RULES.md](./DEVELOPMENT_RULES.md#gestión-de-documentación-y-resúmenes)

---

## 🏗️ FASE 0: Configuración Inicial del Proyecto

**Objetivo**: Tener la estructura base del monorepo funcionando

### Paso 0.1: Estructura del Monorepo

**Tiempo estimado**: 1-2 horas

- [ ] Crear estructura de carpetas del proyecto
- [ ] Configurar Turborepo
- [ ] Configurar pnpm workspaces
- [ ] Crear `package.json` raíz
- [ ] Configurar ESLint y Prettier globales
- [ ] Configurar TypeScript global
- [ ] Crear archivo `.gitignore`
- [ ] Crear archivo `.env.example`

**Resultado**: Estructura de monorepo lista para trabajar

### Paso 0.2: Configuración de Herramientas

**Tiempo estimado**: 1 hora

- [ ] Configurar Husky (git hooks)
- [ ] Configurar lint-staged
- [ ] Configurar scripts de desarrollo
- [ ] Configurar scripts de build
- [ ] Documentar comandos en README

**Resultado**: Herramientas de desarrollo configuradas

---

## 🔧 FASE 1: Backend Base (API)

**Objetivo**: API funcional con autenticación y base de datos

### Paso 1.1: Configuración Inicial del Backend

**Tiempo estimado**: 2-3 horas

- [ ] Crear proyecto NestJS en `/backend`
- [ ] Configurar TypeScript
- [ ] Configurar variables de entorno
- [ ] Configurar estructura de módulos
- [ ] Configurar logging (Winston)
- [ ] Configurar manejo de errores global
- [ ] Configurar validación (Zod)
- [ ] Configurar CORS

**Resultado**: Backend base funcionando en `http://localhost:3000`

### Paso 1.2: Base de Datos y Prisma

**Tiempo estimado**: 2-3 horas

- [ ] Instalar y configurar Prisma
- [ ] Configurar PostgreSQL (local o Docker)
- [ ] Crear schema inicial de Prisma:
  - User (clientes y profesionales)
  - Business (negocio/peluquería)
  - Service (servicios)
  - Appointment (turnos)
- [ ] Crear primera migración
- [ ] Configurar Prisma Client
- [ ] Crear seeds iniciales (datos de prueba)

**Resultado**: Base de datos funcionando con schema inicial

### Paso 1.3: Módulo de Autenticación

**Tiempo estimado**: 3-4 horas

- [ ] Crear módulo `auth`
- [ ] Implementar registro con email/password
- [ ] Implementar login con email/password
- [ ] Implementar JWT (access + refresh tokens)
- [ ] Implementar Google OAuth 2.0
- [ ] Crear guards de autenticación
- [ ] Crear decoradores personalizados (@CurrentUser)
- [ ] Implementar recuperación de contraseña
- [ ] Tests unitarios del módulo

**Endpoints creados**:

```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/google
POST /api/v1/auth/refresh
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
GET  /api/v1/auth/me
```

**Resultado**: Autenticación completa funcionando

### Paso 1.4: Módulo de Usuarios

**Tiempo estimado**: 2 horas

- [ ] Crear módulo `users`
- [ ] Implementar CRUD de usuarios
- [ ] Implementar roles (customer, professional, admin)
- [ ] Implementar actualización de perfil
- [ ] Implementar cambio de contraseña
- [ ] Tests unitarios

**Endpoints creados**:

```
GET    /api/v1/users/profile
PUT    /api/v1/users/profile
PUT    /api/v1/users/password
DELETE /api/v1/users/account
```

**Resultado**: Gestión de usuarios funcionando

---

## 🎨 FASE 2: Frontend Web - Cliente (Reservas)

**Objetivo**: Página web para que clientes reserven turnos

### Paso 2.1: Configuración Inicial Web Client

**Tiempo estimado**: 2-3 horas

- [ ] Crear proyecto Next.js 15 en `/web-client`
- [ ] Configurar TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Instalar y configurar Shadcn/ui
- [ ] Configurar estructura de carpetas (App Router)
- [ ] Configurar variables de entorno
- [ ] Configurar cliente de API (axios/fetch)
- [ ] Configurar Zustand (estado global)
- [ ] Configurar TanStack Query

**Resultado**: Next.js funcionando en `http://localhost:3001`

### Paso 2.2: Sistema de Autenticación (Frontend)

**Tiempo estimado**: 3-4 horas

- [ ] Crear página de login (`/login`)
- [ ] Crear página de registro (`/register`)
- [ ] Crear página de recuperación de contraseña
- [ ] Implementar formularios con React Hook Form + Zod
- [ ] Implementar login con Google (botón)
- [ ] Crear contexto/store de autenticación
- [ ] Implementar persistencia de sesión
- [ ] Implementar rutas protegidas
- [ ] Crear componente de layout autenticado
- [ ] Manejo de errores de autenticación

**Páginas creadas**:

```
/login
/register
/forgot-password
/reset-password
```

**Resultado**: Sistema de autenticación funcional en web

### Paso 2.3: Página Pública del Negocio

**Tiempo estimado**: 4-5 horas

- [ ] Crear página pública (`/[businessSlug]`)
- [ ] Mostrar información del negocio
- [ ] Mostrar logo y fotos
- [ ] Mostrar servicios disponibles
- [ ] Mostrar horarios de atención
- [ ] Mostrar ubicación en mapa (Google Maps)
- [ ] Mostrar reseñas y valoraciones
- [ ] Botón destacado "Reservar Turno"
- [ ] Diseño responsive y atractivo
- [ ] SEO optimizado (meta tags, Open Graph)

**Páginas creadas**:

```
/[businessSlug]  (ej: /peluqueria-maria)
```

**Resultado**: Landing page pública del negocio funcionando

### Paso 2.4: Flujo de Reserva de Turnos

**Tiempo estimado**: 5-6 horas

- [ ] Crear página de reserva (`/[businessSlug]/reservar`)
- [ ] **Paso 1**: Seleccionar servicio(s)
  - Mostrar lista de servicios
  - Permitir selección múltiple
  - Mostrar precio y duración
- [ ] **Paso 2**: Seleccionar fecha
  - Calendario interactivo
  - Mostrar disponibilidad
  - Deshabilitar días no laborables
- [ ] **Paso 3**: Seleccionar horario
  - Mostrar slots disponibles
  - Actualización en tiempo real
  - Indicar horarios ocupados
- [ ] **Paso 4**: Datos del cliente
  - Formulario de contacto
  - Opción de login/registro
  - Login con Google rápido
- [ ] **Paso 5**: Resumen y confirmación
  - Mostrar resumen completo
  - Mostrar precio total
  - Botón de confirmar
- [ ] Implementar stepper/wizard
- [ ] Validaciones en cada paso
- [ ] Navegación entre pasos

**Páginas creadas**:

```
/[businessSlug]/reservar
```

**Resultado**: Flujo completo de reserva funcionando

### Paso 2.5: Integración de Mercado Pago (Cliente → Profesional)

**Tiempo estimado**: 5-6 horas

**Backend**:

- [ ] Instalar SDK de Mercado Pago
- [ ] Configurar OAuth de Mercado Pago
- [ ] Crear módulo `payments`
- [ ] Implementar conexión de cuenta de profesional
- [ ] Implementar creación de preferencia de pago
- [ ] Implementar webhook de notificaciones
- [ ] Implementar verificación de pago
- [ ] Implementar reembolsos
- [ ] Implementar split payment (comisión de plataforma)

**Frontend**:

- [ ] Integrar checkout de Mercado Pago
- [ ] Mostrar botón de pago
- [ ] Manejar respuesta de pago
- [ ] Página de éxito de pago
- [ ] Página de error de pago
- [ ] Mostrar recibo digital

**Endpoints creados**:

```
POST /api/v1/payments/appointments/:id/create-preference
POST /api/v1/webhooks/mercadopago
GET  /api/v1/payments/:id/status
POST /api/v1/payments/:id/refund
GET  /api/v1/business/:id/mercadopago/connect
POST /api/v1/business/:id/mercadopago/disconnect
```

**Páginas creadas**:

```
/[businessSlug]/pago/exito
/[businessSlug]/pago/error
```

**Resultado**: Pagos de clientes a profesionales funcionando

### Paso 2.6: Panel del Cliente (Mis Turnos)

**Tiempo estimado**: 3-4 horas

- [ ] Crear layout del panel de cliente
- [ ] Crear página "Mis Turnos" (`/cliente/turnos`)
- [ ] Mostrar turnos próximos
- [ ] Mostrar turnos pasados
- [ ] Filtros por estado
- [ ] Ver detalles de cada turno
- [ ] Cancelar turno
- [ ] Reprogramar turno
- [ ] Página de perfil del cliente
- [ ] Editar información personal

**Páginas creadas**:

```
/cliente/turnos
/cliente/perfil
/cliente/historial
```

**Resultado**: Panel de cliente funcionando

---

## 💼 FASE 3: Backend - Módulos de Negocio

**Objetivo**: API completa para gestión del negocio

### Paso 3.1: Módulo de Negocios (Business)

**Tiempo estimado**: 3-4 horas

- [ ] Crear módulo `business`
- [ ] Implementar CRUD de negocios
- [ ] Implementar configuración de negocio
- [ ] Implementar subida de logo
- [ ] Implementar galería de fotos
- [ ] Implementar generación de slug único
- [ ] Implementar generación de QR Code
- [ ] Tests unitarios

**Endpoints creados**:

```
POST   /api/v1/business
GET    /api/v1/business/:slug
PUT    /api/v1/business/:id
DELETE /api/v1/business/:id
POST   /api/v1/business/:id/logo
POST   /api/v1/business/:id/photos
GET    /api/v1/business/:id/qr-code
```

**Resultado**: Gestión de negocios funcionando

### Paso 3.2: Módulo de Servicios

**Tiempo estimado**: 2-3 horas

- [ ] Crear módulo `services`
- [ ] Implementar CRUD de servicios
- [ ] Implementar categorías de servicios
- [ ] Implementar subida de fotos de servicios
- [ ] Implementar ordenamiento de servicios
- [ ] Implementar activar/desactivar servicios
- [ ] Tests unitarios

**Endpoints creados**:

```
GET    /api/v1/business/:businessId/services
POST   /api/v1/business/:businessId/services
PUT    /api/v1/services/:id
DELETE /api/v1/services/:id
POST   /api/v1/services/:id/photos
```

**Resultado**: Gestión de servicios funcionando

### Paso 3.3: Módulo de Turnos (Appointments)

**Tiempo estimado**: 4-5 horas

- [ ] Crear módulo `appointments`
- [ ] Implementar creación de turno
- [ ] Implementar validación de disponibilidad
- [ ] Implementar bloqueo temporal de horario
- [ ] Implementar estados de turno
- [ ] Implementar cancelación de turno
- [ ] Implementar reprogramación de turno
- [ ] Implementar listado de turnos (con filtros)
- [ ] Implementar calendario de disponibilidad
- [ ] Tests unitarios

**Endpoints creados**:

```
POST   /api/v1/appointments
GET    /api/v1/appointments
GET    /api/v1/appointments/:id
PUT    /api/v1/appointments/:id
DELETE /api/v1/appointments/:id
GET    /api/v1/appointments/availability
POST   /api/v1/appointments/:id/cancel
POST   /api/v1/appointments/:id/reschedule
```

**Resultado**: Gestión de turnos funcionando

### Paso 3.4: Módulo de Horarios (Schedules)

**Tiempo estimado**: 3-4 horas

- [ ] Crear módulo `schedules`
- [ ] Implementar configuración de horarios por día
- [ ] Implementar días no laborables
- [ ] Implementar excepciones de horarios
- [ ] Implementar validación de horarios
- [ ] Implementar cálculo de slots disponibles
- [ ] Tests unitarios

**Endpoints creados**:

```
GET /api/v1/business/:businessId/schedule
PUT /api/v1/business/:businessId/schedule
POST /api/v1/business/:businessId/schedule/exceptions
GET /api/v1/business/:businessId/schedule/availability
```

**Resultado**: Configuración de horarios funcionando

### Paso 3.5: Módulo de Notificaciones

**Tiempo estimado**: 3-4 horas

- [ ] Crear módulo `notifications`
- [ ] Configurar servicio de email (SendGrid/Mailgun)
- [ ] Crear plantillas de email
- [ ] Implementar envío de email de confirmación
- [ ] Implementar envío de email de recordatorio
- [ ] Implementar envío de email de cancelación
- [ ] Configurar queue (Bull/BullMQ)
- [ ] Implementar jobs programados
- [ ] Tests unitarios

**Resultado**: Sistema de notificaciones funcionando

---

## 🎛️ FASE 4: Admin Dashboard (Panel de Profesionales)

**Objetivo**: Panel completo para que profesionales gestionen su negocio

### Paso 4.1: Configuración Inicial Admin Dashboard

**Tiempo estimado**: 2-3 horas

- [ ] Crear proyecto Next.js 15 en `/admin-dashboard`
- [ ] Configurar TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Instalar y configurar Shadcn/ui
- [ ] Configurar estructura de carpetas
- [ ] Configurar cliente de API
- [ ] Configurar Zustand
- [ ] Configurar TanStack Query
- [ ] Crear layout del dashboard

**Resultado**: Admin dashboard base funcionando en `http://localhost:3002`

### Paso 4.2: Autenticación Admin

**Tiempo estimado**: 2 horas

- [ ] Crear página de login admin (`/login`)
- [ ] Implementar login con email/password
- [ ] Implementar login con Google
- [ ] Implementar rutas protegidas
- [ ] Crear layout autenticado
- [ ] Implementar sidebar de navegación
- [ ] Implementar header con menú de usuario

**Páginas creadas**:

```
/login
/dashboard
```

**Resultado**: Autenticación admin funcionando

### Paso 4.3: Dashboard Principal

**Tiempo estimado**: 4-5 horas

- [ ] Crear página de dashboard (`/dashboard`)
- [ ] Mostrar métricas del día:
  - Turnos de hoy
  - Ingresos del día
  - Próximos turnos
  - Ocupación
- [ ] Mostrar gráfico de ocupación
- [ ] Mostrar lista de turnos de hoy (timeline)
- [ ] Mostrar alertas y notificaciones
- [ ] Implementar notificaciones en tiempo real (Socket.io)
- [ ] Diseño responsive

**Páginas creadas**:

```
/dashboard
```

**Resultado**: Dashboard principal funcionando

### Paso 4.4: Calendario de Turnos

**Tiempo estimado**: 5-6 horas

- [ ] Crear página de calendario (`/dashboard/turnos`)
- [ ] Integrar FullCalendar
- [ ] Vista de día (timeline)
- [ ] Vista de semana (grid)
- [ ] Vista de mes (calendario)
- [ ] Código de colores por estado
- [ ] Click para ver detalles del turno
- [ ] Modal de detalles del turno
- [ ] Crear turno manual
- [ ] Editar turno
- [ ] Cancelar turno
- [ ] Drag & drop para mover turnos (opcional v1.5)
- [ ] Filtros por estado, servicio, etc.

**Páginas creadas**:

```
/dashboard/turnos
```

**Resultado**: Calendario de turnos funcionando

### Paso 4.5: Gestión de Servicios

**Tiempo estimado**: 3-4 horas

- [ ] Crear página de servicios (`/dashboard/servicios`)
- [ ] Listar todos los servicios
- [ ] Crear nuevo servicio (modal/página)
- [ ] Editar servicio
- [ ] Eliminar/archivar servicio
- [ ] Subir fotos de servicio
- [ ] Ordenar servicios (drag & drop)
- [ ] Activar/desactivar servicio
- [ ] Crear categorías de servicios
- [ ] Asignar servicios a categorías

**Páginas creadas**:

```
/dashboard/servicios
/dashboard/servicios/nuevo
/dashboard/servicios/:id/editar
```

**Resultado**: Gestión de servicios funcionando

### Paso 4.6: Gestión de Clientes

**Tiempo estimado**: 3-4 horas

- [ ] Crear página de clientes (`/dashboard/clientes`)
- [ ] Listar todos los clientes
- [ ] Buscar cliente (por nombre, email, teléfono)
- [ ] Filtrar clientes (activos, nuevos, frecuentes)
- [ ] Ver perfil del cliente (modal/página)
- [ ] Ver historial de turnos del cliente
- [ ] Ver estadísticas del cliente
- [ ] Agregar notas al cliente
- [ ] Exportar lista de clientes (CSV)

**Páginas creadas**:

```
/dashboard/clientes
/dashboard/clientes/:id
```

**Resultado**: Gestión de clientes funcionando

### Paso 4.7: Configuración de Horarios

**Tiempo estimado**: 3-4 horas

- [ ] Crear página de horarios (`/dashboard/configuracion/horarios`)
- [ ] Configurar días laborables
- [ ] Configurar horarios por día de la semana
- [ ] Configurar horario de almuerzo/break
- [ ] Configurar duración de slots
- [ ] Configurar tiempo de buffer entre turnos
- [ ] Marcar días festivos/vacaciones
- [ ] Calendario de excepciones
- [ ] Vista previa de disponibilidad

**Páginas creadas**:

```
/dashboard/configuracion/horarios
```

**Resultado**: Configuración de horarios funcionando

### Paso 4.8: Configuración del Negocio

**Tiempo estimado**: 3-4 horas

- [ ] Crear página de configuración (`/dashboard/configuracion/negocio`)
- [ ] Editar información del negocio
- [ ] Subir logo
- [ ] Subir fotos del local
- [ ] Configurar ubicación (Google Maps)
- [ ] Configurar redes sociales
- [ ] Configurar URL personalizada (slug)
- [ ] Ver link compartible
- [ ] Generar QR Code
- [ ] Descargar QR Code (PNG, SVG, PDF)
- [ ] Botones para compartir (WhatsApp, email, etc.)

**Páginas creadas**:

```
/dashboard/configuracion/negocio
/dashboard/configuracion/links
```

**Resultado**: Configuración del negocio funcionando

### Paso 4.9: Configuración de Pagos (Recibir de Clientes)

**Tiempo estimado**: 3-4 horas

- [ ] Crear página de pagos (`/dashboard/configuracion/pagos`)
- [ ] **Botón "Conectar Mercado Pago"** (OAuth)
- [ ] Flujo de autorización de Mercado Pago
- [ ] Mostrar estado de conexión
- [ ] Desconectar cuenta de Mercado Pago
- [ ] Activar/desactivar pagos online
- [ ] Configurar porcentaje de seña por defecto
- [ ] Configurar porcentaje de seña por servicio
- [ ] Configurar política de cancelación
- [ ] Ver comisiones de Mercado Pago
- [ ] Ver historial de pagos recibidos
- [ ] Filtrar pagos por fecha, estado, método
- [ ] Procesar reembolsos

**Páginas creadas**:

```
/dashboard/configuracion/pagos
/dashboard/pagos
```

**Resultado**: Configuración de pagos funcionando

### Paso 4.10: Suscripción a la Plataforma (Profesional → Plataforma)

**Tiempo estimado**: 4-5 horas

**Backend**:

- [ ] Crear módulo `subscriptions`
- [ ] Definir planes de suscripción
- [ ] Crear planes en Mercado Pago
- [ ] Implementar creación de suscripción
- [ ] Implementar webhook de suscripciones
- [ ] Implementar verificación de suscripción activa
- [ ] Implementar cancelación de suscripción
- [ ] Implementar cambio de plan
- [ ] Implementar período de prueba gratuito
- [ ] Middleware para verificar suscripción activa

**Frontend**:

- [ ] Crear página de suscripción (`/dashboard/suscripcion`)
- [ ] Mostrar plan actual
- [ ] Mostrar próximo cobro
- [ ] Mostrar historial de pagos a la plataforma
- [ ] Descargar facturas
- [ ] Página de selección de plan
- [ ] Página de pago de suscripción
- [ ] Cambiar plan
- [ ] Cancelar suscripción
- [ ] Banner de suscripción vencida

**Endpoints creados**:

```
GET  /api/v1/subscriptions/plans
POST /api/v1/subscriptions
GET  /api/v1/subscriptions/current
PUT  /api/v1/subscriptions/change-plan
DELETE /api/v1/subscriptions/current
POST /api/v1/webhooks/mercadopago/subscriptions
```

**Páginas creadas**:

```
/dashboard/suscripcion
/dashboard/suscripcion/planes
/dashboard/suscripcion/pago
```

**Resultado**: Sistema de suscripciones funcionando

### Paso 4.11: Reportes Básicos

**Tiempo estimado**: 3-4 horas

- [ ] Crear página de reportes (`/dashboard/reportes`)
- [ ] Reporte de turnos por período
- [ ] Reporte de ingresos por período (de clientes)
- [ ] Reporte de gastos (suscripción + comisiones)
- [ ] Ganancia neta (ingresos - gastos)
- [ ] Reporte de servicios más solicitados
- [ ] Reporte de horarios más ocupados
- [ ] Gráficos básicos (Recharts)
- [ ] Filtros por fecha
- [ ] Exportar reportes (PDF, Excel)

**Páginas creadas**:

```
/dashboard/reportes
```

**Resultado**: Reportes básicos funcionando

---

## 🔄 FASE 5: Sincronización en Tiempo Real

**Objetivo**: Actualizaciones instantáneas entre web y admin

### Paso 5.1: Configuración de WebSockets

**Tiempo estimado**: 3-4 horas

**Backend**:

- [ ] Instalar y configurar Socket.io
- [ ] Crear módulo `websockets`
- [ ] Implementar eventos de turnos
- [ ] Implementar eventos de pagos
- [ ] Implementar autenticación de sockets
- [ ] Implementar rooms por negocio

**Frontend (Web + Admin)**:

- [ ] Instalar Socket.io client
- [ ] Crear hook `useSocket`
- [ ] Conectar al servidor de sockets
- [ ] Escuchar eventos de turnos
- [ ] Actualizar UI en tiempo real
- [ ] Mostrar notificaciones toast

**Eventos implementados**:

```
appointment:created
appointment:updated
appointment:cancelled
payment:confirmed
```

**Resultado**: Sincronización en tiempo real funcionando

---

## 🧪 FASE 6: Testing y Optimización

**Objetivo**: Sistema estable y optimizado

### Paso 6.1: Testing

**Tiempo estimado**: 4-5 horas

- [ ] Tests unitarios backend (>70% cobertura)
- [ ] Tests de integración API
- [ ] Tests E2E flujo de reserva (Playwright)
- [ ] Tests E2E flujo de admin (Playwright)
- [ ] Corregir bugs encontrados

**Resultado**: Sistema testeado y estable

### Paso 6.2: Optimización y Performance

**Tiempo estimado**: 2-3 horas

- [ ] Optimizar queries de base de datos
- [ ] Agregar índices necesarios
- [ ] Implementar caché en endpoints críticos
- [ ] Optimizar imágenes
- [ ] Implementar lazy loading
- [ ] Optimizar bundle size
- [ ] Lighthouse audit (>90 score)

**Resultado**: Sistema optimizado

### Paso 6.3: SEO y Accesibilidad

**Tiempo estimado**: 2-3 horas

- [ ] Implementar meta tags dinámicos
- [ ] Implementar Open Graph tags
- [ ] Implementar Schema.org markup
- [ ] Implementar sitemap.xml
- [ ] Implementar robots.txt
- [ ] Audit de accesibilidad (a11y)
- [ ] Corregir issues de accesibilidad

**Resultado**: SEO y accesibilidad optimizados

---

## 🚀 FASE 7: Deployment y Producción

**Objetivo**: Sistema en producción funcionando

### Paso 7.1: Preparación para Producción

**Tiempo estimado**: 2-3 horas

- [ ] Configurar variables de entorno de producción
- [ ] Configurar base de datos de producción
- [ ] Configurar Redis de producción
- [ ] Configurar storage de imágenes (Cloudinary)
- [ ] Configurar dominio y SSL
- [ ] Configurar monitoreo (Sentry)
- [ ] Configurar analytics (Google Analytics)

**Resultado**: Configuración de producción lista

### Paso 7.2: Deployment Backend

**Tiempo estimado**: 2-3 horas

- [ ] Configurar Railway/Render para backend
- [ ] Configurar PostgreSQL en Railway/Render
- [ ] Configurar Redis en Railway/Render
- [ ] Deploy de backend
- [ ] Ejecutar migraciones en producción
- [ ] Ejecutar seeds en producción
- [ ] Verificar funcionamiento

**Resultado**: Backend en producción

### Paso 7.3: Deployment Frontend

**Tiempo estimado**: 2-3 horas

- [ ] Configurar Vercel para web-client
- [ ] Configurar Vercel para admin-dashboard
- [ ] Configurar variables de entorno
- [ ] Deploy de web-client
- [ ] Deploy de admin-dashboard
- [ ] Configurar dominios personalizados
- [ ] Verificar funcionamiento

**Resultado**: Frontend en producción

### Paso 7.4: Testing en Producción

**Tiempo estimado**: 2-3 horas

- [ ] Probar flujo completo de reserva
- [ ] Probar pagos con Mercado Pago (modo test)
- [ ] Probar notificaciones
- [ ] Probar admin dashboard
- [ ] Probar sincronización en tiempo real
- [ ] Verificar performance
- [ ] Verificar SEO

**Resultado**: Sistema funcionando en producción

---

## 📱 FASE 8: App Móvil (Posterior)

**Objetivo**: App móvil para clientes (iOS y Android)

### Paso 8.1: Configuración Inicial Mobile

**Tiempo estimado**: 2-3 horas

- [ ] Crear proyecto Expo en `/mobile-client`
- [ ] Configurar TypeScript
- [ ] Configurar Expo Router
- [ ] Configurar NativeWind (Tailwind)
- [ ] Configurar estructura de carpetas
- [ ] Configurar cliente de API
- [ ] Configurar Zustand
- [ ] Configurar TanStack Query

**Resultado**: Proyecto mobile base funcionando

### Paso 8.2: Reutilización de Lógica

**Tiempo estimado**: 3-4 horas

- [ ] Mover tipos TypeScript a `/shared`
- [ ] Mover schemas Zod a `/shared`
- [ ] Mover utilidades a `/shared`
- [ ] Mover servicios API a `/shared`
- [ ] Configurar imports desde shared

**Resultado**: Código compartido entre web y mobile

### Paso 8.3: Implementación de Pantallas

**Tiempo estimado**: 8-10 horas

- [ ] Pantalla de splash
- [ ] Pantalla de onboarding
- [ ] Pantalla de login/registro
- [ ] Pantalla principal (explorar negocios)
- [ ] Pantalla de negocio
- [ ] Pantalla de reserva (wizard)
- [ ] Pantalla de pago
- [ ] Pantalla de mis turnos
- [ ] Pantalla de perfil
- [ ] Navegación entre pantallas

**Resultado**: App móvil funcionando

### Paso 8.4: Funcionalidades Nativas

**Tiempo estimado**: 3-4 horas

- [ ] Implementar push notifications
- [ ] Implementar acceso a cámara
- [ ] Implementar acceso a galería
- [ ] Implementar agregar a calendario
- [ ] Implementar compartir en redes
- [ ] Implementar deep linking

**Resultado**: Funcionalidades nativas implementadas

### Paso 8.5: Build y Publicación

**Tiempo estimado**: 3-4 horas

- [ ] Configurar EAS Build
- [ ] Crear build de desarrollo
- [ ] Probar en dispositivos físicos
- [ ] Crear build de producción
- [ ] Publicar en Google Play Store
- [ ] Publicar en Apple App Store

**Resultado**: App móvil publicada en stores

---

## 📊 Resumen de Tiempos Estimados

### Fase Web (Prioridad)

| Fase                      | Tiempo Estimado  |
| ------------------------- | ---------------- |
| 0. Configuración Inicial  | 2-3 horas        |
| 1. Backend Base           | 12-15 horas      |
| 2. Frontend Web Cliente   | 20-25 horas      |
| 3. Backend Módulos        | 15-20 horas      |
| 4. Admin Dashboard        | 30-35 horas      |
| 5. Tiempo Real            | 3-4 horas        |
| 6. Testing y Optimización | 8-11 horas       |
| 7. Deployment             | 6-9 horas        |
| **TOTAL WEB**             | **96-122 horas** |

### Fase Mobile (Posterior)

| Fase             | Tiempo Estimado |
| ---------------- | --------------- |
| 8. App Móvil     | 19-24 horas     |
| **TOTAL MOBILE** | **19-24 horas** |

### **TOTAL PROYECTO COMPLETO**: 115-146 horas

---

## ✅ Criterios de Éxito por Fase

### Fase Web Completa ✓

- [ ] Cliente puede registrarse/login (email + Google)
- [ ] Cliente puede ver página del negocio
- [ ] Cliente puede reservar turno completo
- [ ] Cliente puede pagar seña con Mercado Pago
- [ ] Cliente recibe confirmación por email
- [ ] Cliente puede ver sus turnos
- [ ] Cliente puede cancelar turno
- [ ] Profesional puede login (email + Google)
- [ ] Profesional ve dashboard con métricas
- [ ] Profesional ve calendario de turnos
- [ ] Profesional puede crear/editar/cancelar turnos
- [ ] Profesional puede gestionar servicios
- [ ] Profesional puede gestionar clientes
- [ ] Profesional puede configurar horarios
- [ ] Profesional puede configurar negocio
- [ ] Profesional puede generar link compartible
- [ ] Profesional puede descargar QR Code
- [ ] Sincronización en tiempo real funciona
- [ ] Sistema funciona en producción

### Fase Mobile Completa ✓

- [ ] App instalable en iOS y Android
- [ ] Todas las funcionalidades de web funcionan
- [ ] Push notifications funcionan
- [ ] App publicada en stores

---

## 🎯 Próximos Pasos Inmediatos

1. **Revisar y aprobar este workflow**
2. **Comenzar con Fase 0: Configuración Inicial**
3. **Avanzar fase por fase, probando cada funcionalidad**
4. **Mantener comunicación constante sobre progreso**

---

## 📝 Notas Importantes

- ⚠️ Los tiempos son estimados y pueden variar
- ⚠️ Cada fase debe completarse antes de avanzar a la siguiente
- ⚠️ Probar exhaustivamente cada funcionalidad antes de continuar
- ⚠️ Mantener código limpio y documentado en todo momento
- ⚠️ Hacer commits frecuentes con mensajes claros
- ⚠️ Priorizar funcionalidad sobre perfección visual en v1.0

---

_Documento creado: 2025-11-06_
_Versión: 1.0_
