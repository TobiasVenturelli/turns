# Turns - Web Client

Frontend web para clientes del sistema de gestión de turnos.

## 🚀 Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4
- **UI Components**: Shadcn/ui
- **Estado Global**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Formularios**: React Hook Form + Zod
- **Iconos**: Lucide React

## 📦 Instalación

```bash
# Desde la raíz del monorepo
pnpm install

# Solo este workspace
cd apps/web-client
pnpm install
```

## 🔧 Configuración

Crear archivo `.env.local` basado en `.env.example`:

```bash
cp .env.example .env.local
```

Variables de entorno:

- `NEXT_PUBLIC_API_URL`: URL del backend API
- `NEXT_PUBLIC_APP_URL`: URL de la aplicación web
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Client ID de Google OAuth

## 🏃‍♂️ Desarrollo

```bash
# Modo desarrollo con Turbopack
pnpm dev

# Build de producción
pnpm build

# Iniciar en producción
pnpm start

# Linting
pnpm lint
```

## 📂 Estructura de Carpetas

```
src/
├── app/              # App Router (páginas y layouts)
├── components/       # Componentes React
│   └── ui/          # Componentes de Shadcn/ui
├── hooks/           # Custom hooks
├── services/        # Servicios de API
├── stores/          # Stores de Zustand
├── types/           # Tipos TypeScript
├── config/          # Configuraciones
├── constants/       # Constantes
└── lib/             # Utilidades
```

## 🎨 Features

- ✅ Configuración inicial con Next.js 15
- ✅ TypeScript configurado
- ✅ Tailwind CSS 4
- ✅ Shadcn/ui componentes
- ✅ Cliente API con Axios
- ✅ Zustand para estado global
- ✅ TanStack Query para data fetching
- ✅ Sistema de autenticación (hooks y store)
- ⏳ Páginas de login/register
- ⏳ Dashboard de cliente
- ⏳ Flujo de reserva de turnos

## 🔗 Enlaces

- Backend API: http://localhost:3000
- Web Client: http://localhost:3001
- Admin Dashboard: http://localhost:3002 (próximamente)

## 📝 Scripts Disponibles

- `dev`: Inicia el servidor de desarrollo
- `build`: Crea build de producción
- `start`: Inicia servidor de producción
- `lint`: Ejecuta ESLint
- `type-check`: Verifica tipos de TypeScript
