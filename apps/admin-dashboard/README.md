# 💼 Admin Dashboard - Panel de Administración

Panel de administración para profesionales de la plataforma Turns.

## 🚀 Stack Tecnológico

- **Next.js 15** - Framework React con App Router
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Estilos utility-first
- **Shadcn/ui** - Componentes UI accesibles
- **Zustand** - Estado global
- **TanStack Query** - Manejo de estado servidor
- **React Hook Form** - Formularios optimizados
- **Zod** - Validación de schemas
- **Axios** - Cliente HTTP
- **FullCalendar** - Calendario de turnos
- **Recharts** - Gráficos y estadísticas
- **Socket.io** - Sincronización en tiempo real

## 📦 Instalación

```bash
# Instalar dependencias
pnpm install

# Copiar variables de entorno
cp .env.local.example .env.local
```

## 🛠️ Desarrollo

```bash
# Iniciar servidor de desarrollo en puerto 3002
pnpm dev

# Build de producción
pnpm build

# Iniciar en producción
pnpm start

# Linting
pnpm lint

# Type checking
pnpm type-check
```

## 🌐 URLs

- **Dev**: http://localhost:3002
- **API**: http://localhost:3000/api/v1

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── (dashboard)/       # Grupo de rutas protegidas
│   │   ├── dashboard/     # Dashboard principal
│   │   ├── turnos/        # Gestión de turnos
│   │   ├── clientes/      # Gestión de clientes
│   │   ├── servicios/     # Gestión de servicios
│   │   └── layout.tsx     # Layout del dashboard
│   ├── login/             # Página de login
│   └── layout.tsx         # Layout raíz
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base (Shadcn)
│   └── dashboard/        # Componentes del dashboard
├── services/             # Servicios API
├── stores/               # Stores de Zustand
├── hooks/                # Custom hooks
├── lib/                  # Utilidades
├── types/                # Tipos TypeScript
└── config/               # Configuración
```

## 🔐 Autenticación

El dashboard requiere autenticación con rol `PROFESSIONAL`:

1. Login con email/password
2. Login con Google OAuth
3. Tokens JWT (access + refresh)
4. Refresh automático de tokens
5. Rutas protegidas

## ✨ Funcionalidades Principales

### Dashboard

- Métricas del día
- Resumen de ingresos
- Próximos turnos
- Actividad reciente

### Gestión de Turnos

- Calendario interactivo
- Crear/editar/cancelar turnos
- Filtros por estado
- Vista día/semana/mes

### Gestión de Clientes

- Lista completa de clientes
- Historial de cada cliente
- Búsqueda y filtros

### Gestión de Servicios

- CRUD de servicios
- Precios y duración
- Activar/desactivar

### Configuración

- Datos del negocio
- Horarios de atención
- Configuración de pagos
- Link compartible y QR

## 🔗 Integración con Backend

Todas las llamadas a API se hacen a través de servicios en `src/services/`:

- `auth.service.ts` - Autenticación
- `appointments.service.ts` - Turnos
- `business.service.ts` - Negocio
- `services.service.ts` - Servicios
- `customers.service.ts` - Clientes

## 📝 Variables de Entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3002
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=TEST-xxx
```

## 🎨 Personalización

Los estilos se pueden personalizar en:

- `tailwind.config.ts` - Configuración de Tailwind
- `src/app/globals.css` - Estilos globales
- `components.json` - Configuración de Shadcn/ui

## 📄 Licencia

Privado - Uso exclusivo del proyecto Turns
