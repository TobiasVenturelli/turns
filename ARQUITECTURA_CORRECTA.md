# 🏗️ Arquitectura Correcta del Proyecto Turns

**Fecha**: 13 de Noviembre, 2025  
**Versión**: 1.0 Corregida

---

## 🎯 Visión General

El proyecto Turns tiene **3 aplicaciones principales** con roles bien definidos:

1. **Landing Page** - Para que profesionales conozcan y se registren
2. **Admin Dashboard** - Panel exclusivo para profesionales
3. **Web Client** - Página pública del negocio (acceso por link compartible)

---

## 📱 Aplicaciones del Sistema

### 1. Landing Page (Puerto 3003)

**Propósito**: Captar profesionales y explicar el producto

**Funcionalidades**:

- ✅ Información del producto
- ✅ Características y beneficios
- ✅ Precios ($20,000 ARS/mes con 7 días gratis)
- ✅ Registro de profesionales
- ✅ Login de profesionales → Redirige al Admin Dashboard

**URL**: `http://localhost:3003` (Producción: `turns.com`)

**Público objetivo**: Profesionales (peluqueros, manicuras, etc.)

---

### 2. Admin Dashboard (Puerto 3002)

**Propósito**: Panel de control para profesionales

**Funcionalidades**:

- ✅ Dashboard con métricas
- ✅ Calendario de turnos (día/semana/mes)
- ✅ Gestión de servicios
- ✅ Gestión de clientes
- ✅ Configuración de horarios
- ✅ Configuración del negocio
- ✅ **Generar link compartible** para clientes
- ✅ Conectar Mercado Pago (recibir pagos)
- ✅ Pagar suscripción a la plataforma
- ✅ Reportes y estadísticas

**URL**: `http://localhost:3002` (Producción: `admin.turns.com`)

**Público objetivo**: Solo profesionales con cuenta activa

**Autenticación**: Email/password o Google OAuth

---

### 3. Web Client (Puerto 3001)

**Propósito**: Página pública del negocio para que clientes reserven

**Funcionalidades**:

- ✅ Página del negocio (por link compartible)
- ✅ Ver servicios disponibles
- ✅ Ver horarios de atención
- ✅ Ver ubicación en mapa
- ✅ **Reservar turno** (wizard de 5 pasos)
- ✅ Pagar seña con Mercado Pago
- ✅ Login/registro (solo al momento de reservar)
- ❌ **NO** hay dashboard del cliente
- ❌ **NO** hay búsqueda de negocios
- ❌ **NO** hay lista de "negocios disponibles"

**URL**: `http://localhost:3001/[businessSlug]` (Producción: `turns.com/[businessSlug]`)

**Ejemplo**: `turns.com/peluqueria-maria`

**Público objetivo**: Clientes finales que reciben el link del profesional

**Autenticación**: Solo cuando van a reservar (opcional con Google)

---

## 🔄 Flujo Completo del Sistema

### Flujo del Profesional:

```
1. Ve Landing Page (turns.com)
   ↓
2. Se registra y paga suscripción ($20,000/mes)
   ↓
3. Accede al Admin Dashboard
   ↓
4. Configura su negocio (servicios, horarios, etc.)
   ↓
5. Conecta su cuenta de Mercado Pago
   ↓
6. Genera su link compartible: turns.com/su-negocio
   ↓
7. Comparte el link en redes sociales, WhatsApp, etc.
   ↓
8. Gestiona turnos desde el dashboard
```

### Flujo del Cliente:

```
1. Recibe link del profesional (ej: turns.com/peluqueria-maria)
   ↓
2. Ve la página del negocio (servicios, horarios, ubicación)
   ↓
3. Click en "Reservar Turno"
   ↓
4. Wizard de reserva:
   - Selecciona servicio
   - Selecciona fecha
   - Selecciona horario
   - Ingresa datos personales (o hace login)
   - Paga seña con Mercado Pago
   ↓
5. Recibe confirmación por email
   ↓
6. FIN (NO accede a ningún dashboard)
```

---

## 📂 Estructura de Carpetas

```
Turns/
├── apps/
│   ├── landing/              ✅ Landing para profesionales
│   │   ├── app/
│   │   │   └── page.tsx      # Página principal
│   │   └── package.json
│   │
│   ├── admin-dashboard/      ✅ Panel del profesional
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (dashboard)/
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── turnos/
│   │   │   │   │   ├── servicios/
│   │   │   │   │   ├── clientes/
│   │   │   │   │   ├── configuracion/
│   │   │   │   │   └── reportes/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   └── components/
│   │   └── package.json
│   │
│   └── web-client/           ✅ Página pública del negocio
│       ├── src/
│       │   ├── app/
│       │   │   ├── page.tsx              # Redirige a landing
│       │   │   ├── (auth)/
│       │   │   │   ├── login/            # Login de cliente
│       │   │   │   └── register/         # Registro de cliente
│       │   │   └── [businessSlug]/
│       │   │       ├── page.tsx          # Página del negocio
│       │   │       ├── reservar/         # Wizard de reserva
│       │   │       ├── pago/             # Confirmación de pago
│       │   │       └── reserva-confirmada/
│       │   └── components/
│       │       ├── business/             # Componentes del negocio
│       │       └── ui/                   # Componentes base
│       └── package.json
│
├── contexto/                 ✅ Documentación
│   ├── DEVELOPMENT_RULES.md
│   ├── FEATURES.md
│   ├── PAYMENT_FLOWS.md
│   └── WORKFLOW_V2.md
│
└── scripts/                  ✅ Scripts de utilidad
    ├── start-all.ps1
    ├── stop-all.ps1
    └── restart-all.ps1
```

---

## ❌ Lo que NO debe existir

### En Web Client:

- ❌ Página principal con lista de "Negocios disponibles"
- ❌ Dashboard del cliente (`/[businessSlug]/cliente/*`)
- ❌ Página "Mis Turnos" del cliente
- ❌ Página "Historial" del cliente
- ❌ Página "Mi Perfil" del cliente
- ❌ Búsqueda de negocios
- ❌ Explorar negocios

### Razón:

El cliente **NO tiene cuenta en la plataforma**. Solo reserva turnos a través del link que le comparte el profesional. No necesita ver sus turnos porque:

- El profesional gestiona todo desde su dashboard
- El cliente recibe confirmación por email/SMS
- Si el cliente quiere cancelar, contacta al profesional directamente

---

## 🔐 Autenticación

### Profesional (Admin Dashboard):

- Email/password
- Google OAuth
- Requiere suscripción activa

### Cliente (Web Client):

- **Opcional**: Solo si quiere guardar sus datos para futuras reservas
- Email/password
- Google OAuth (más rápido)
- También puede reservar como "invitado" (sin cuenta)

---

## 💰 Flujos de Pago

### 1. Profesional → Plataforma

- **Concepto**: Suscripción mensual
- **Monto**: $20,000 ARS/mes
- **Trial**: 7 días gratis
- **Método**: Mercado Pago (suscripción recurrente)
- **Gestión**: Desde Admin Dashboard → Suscripción

### 2. Cliente → Profesional

- **Concepto**: Seña del turno
- **Monto**: % configurable (ej: 30% del total)
- **Método**: Mercado Pago (pago único)
- **Flujo**: Durante la reserva del turno
- **Destino**: Cuenta de Mercado Pago del profesional (OAuth)

---

## 🌐 URLs de Producción (Ejemplo)

### Landing Page:

- `https://turns.com`
- `https://www.turns.com`

### Admin Dashboard:

- `https://admin.turns.com`
- `https://dashboard.turns.com`

### Web Client (Páginas de negocios):

- `https://turns.com/peluqueria-maria`
- `https://turns.com/salon-bella`
- `https://turns.com/spa-relax`

---

## 📊 Comparación con lo Anterior

| Aspecto                     | ❌ Antes (Incorrecto)              | ✅ Ahora (Correcto)           |
| --------------------------- | ---------------------------------- | ----------------------------- |
| Página principal web-client | Lista de negocios disponibles      | Redirige a landing            |
| Cliente tiene dashboard     | Sí (Mis Turnos, Historial, Perfil) | No                            |
| Cliente busca negocios      | Sí                                 | No                            |
| Cliente accede por          | Busca en la plataforma             | Link del profesional          |
| Enfoque del web-client      | Marketplace de negocios            | Página individual del negocio |

---

## 🎯 Principios Clave

1. **El cliente NO es usuario de la plataforma**
   - No tiene cuenta permanente
   - No tiene dashboard
   - Solo reserva turnos

2. **El profesional es el cliente de la plataforma**
   - Paga suscripción mensual
   - Tiene dashboard completo
   - Genera y comparte su link

3. **El web-client es una "landing page del negocio"**
   - Cada negocio tiene su propia página
   - Acceso solo por link directo
   - No hay navegación entre negocios

4. **Simplicidad para el cliente final**
   - Recibe link → Ve servicios → Reserva → Paga → Listo
   - Sin complicaciones ni cuentas obligatorias

---

## ✅ Checklist de Arquitectura

- ✅ Landing page para profesionales
- ✅ Admin dashboard solo para profesionales
- ✅ Web client sin dashboard de cliente
- ✅ Web client sin lista de negocios
- ✅ Página del negocio accesible por link
- ✅ Wizard de reserva funcional
- ✅ Login/registro de cliente opcional
- ✅ Pago de seña con Mercado Pago
- ✅ Sistema de suscripciones (pendiente implementar)

---

## 🚀 Próximos Pasos

1. **Implementar sistema de suscripciones** (Profesional → Plataforma)
2. **Completar integración de Mercado Pago OAuth** (Cliente → Profesional)
3. **Agregar WebSockets** para sincronización en tiempo real
4. **Testing completo** de todos los flujos
5. **Deployment a producción**

---

_Última actualización: 2025-11-13_  
_Documentado por: AI Assistant_
