# 📋 Reglas de Desarrollo del Proyecto

## 🎯 Principios Fundamentales

Este documento establece las reglas y mejores prácticas que se deben seguir en todo el proyecto de Sistema de Turnos para Peluquería.

## 📱 Arquitectura del Sistema

### Visión General

El sistema está compuesto por **3 aplicaciones principales** que comparten el mismo backend:

1. **Web App (Cliente Final)** - Para que los clientes reserven turnos
2. **Mobile App (Cliente Final)** - App descargable para clientes (iOS/Android)
3. **Admin Dashboard (Profesionales)** - Panel de control para peluqueros, manicuras, etc.

**Características clave:**

- ✅ **Sincronización en tiempo real** entre todas las plataformas
- ✅ **Backend unificado** con API REST/GraphQL
- ✅ **Base de datos centralizada** con sincronización instantánea
- ✅ **WebSockets** para actualizaciones en tiempo real
- ✅ **Autenticación diferenciada** (clientes vs profesionales)

### Roles del Sistema

#### 1. Cliente (Customer)

- Reservar turnos desde web o mobile
- Ver historial de citas
- Recibir notificaciones
- Cancelar/reprogramar turnos

#### 2. Profesional (Professional)

- Panel de administración completo
- Gestionar agenda y disponibilidad
- Ver todos los turnos del día/semana/mes
- Gestionar servicios y precios
- Ver estadísticas y reportes
- Gestionar clientes
- Configurar horarios de trabajo

#### 3. Super Admin (opcional para futuro)

- Gestionar múltiples profesionales
- Configuración del sistema
- Reportes globales

---

## 💻 Estándares de Código

### 1. Mejores Prácticas 2025

- ✅ Utilizar las últimas características estables de JavaScript/TypeScript (ES2024+)
- ✅ Implementar TypeScript en todo el proyecto para type safety
- ✅ Seguir principios SOLID y Clean Code
- ✅ Aplicar patrones de diseño modernos y probados
- ✅ Utilizar hooks modernos de React (useState, useEffect, useCallback, useMemo, etc.)
- ✅ Implementar Server Components y App Router en Next.js cuando sea apropiado

### 2. Nomenclatura y Idioma

```javascript
// ✅ CORRECTO: Nombres en inglés
class UserService {
  async getUserById(userId) {
    // ❌ Comentarios SIEMPRE en español
    // Busca un usuario por su ID en la base de datos
    return await this.repository.findById(userId);
  }
}

// ❌ INCORRECTO: Nombres en español
class ServicioUsuario {
  async obtenerUsuarioPorId(idUsuario) {
    // Comments in English
    return await this.repositorio.buscarPorId(idUsuario);
  }
}
```

**Reglas específicas:**

- 🔤 **Variables, funciones, clases, métodos**: SIEMPRE en inglés
- 💬 **Comentarios y documentación**: SIEMPRE en español
- 📝 **Commits y documentación técnica**: En español
- 🌐 **Textos de UI/UX**: En español (para el usuario final)

### 3. Modularidad

- 📦 Cada módulo debe tener una única responsabilidad (Single Responsibility Principle)
- 🔌 Componentes y servicios deben ser reutilizables
- 📂 Estructura de carpetas clara y organizada:

```
proyecto/
├── backend/                    # API Backend (Node.js + Express/NestJS)
│   ├── src/
│   │   ├── config/            # Configuraciones y variables de entorno
│   │   ├── modules/           # Módulos por funcionalidad
│   │   │   ├── auth/          # Autenticación (JWT, roles)
│   │   │   ├── appointments/  # Gestión de turnos
│   │   │   ├── customers/     # Gestión de clientes
│   │   │   ├── professionals/ # Gestión de profesionales
│   │   │   ├── services/      # Servicios ofrecidos
│   │   │   ├── notifications/ # Sistema de notificaciones
│   │   │   └── analytics/     # Estadísticas y reportes
│   │   ├── shared/            # Código compartido
│   │   │   ├── middlewares/   # Middlewares (auth, error handling)
│   │   │   ├── utils/         # Utilidades
│   │   │   ├── validators/    # Validaciones con Zod
│   │   │   └── types/         # Tipos TypeScript compartidos
│   │   ├── database/          # Configuración de BD
│   │   │   ├── migrations/    # Migraciones
│   │   │   ├── seeds/         # Datos iniciales
│   │   │   └── models/        # Modelos/Schemas
│   │   └── websockets/        # WebSocket para tiempo real
│   └── tests/                 # Tests del backend
│
├── web-client/                # App Web para CLIENTES (Next.js)
│   ├── src/
│   │   ├── app/              # App Router
│   │   │   ├── (auth)/       # Rutas de autenticación
│   │   │   ├── (booking)/    # Flujo de reserva
│   │   │   └── (profile)/    # Perfil de cliente
│   │   ├── components/
│   │   │   ├── ui/           # Componentes base
│   │   │   ├── booking/      # Componentes de reserva
│   │   │   └── layout/       # Layout del cliente
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API calls
│   │   ├── store/            # Estado global (Zustand)
│   │   └── types/            # Tipos TypeScript
│   └── public/               # Assets públicos
│
├── mobile-client/            # App Mobile para CLIENTES (React Native + Expo)
│   ├── src/
│   │   ├── screens/          # Pantallas principales
│   │   │   ├── auth/         # Login/Register
│   │   │   ├── booking/      # Reserva de turnos
│   │   │   ├── profile/      # Perfil
│   │   │   └── appointments/ # Mis turnos
│   │   ├── components/       # Componentes reutilizables
│   │   ├── navigation/       # React Navigation
│   │   ├── services/         # API calls
│   │   ├── hooks/            # Custom hooks
│   │   ├── store/            # Estado global
│   │   └── utils/            # Utilidades
│   └── assets/               # Imágenes, fuentes, etc.
│
├── admin-dashboard/          # Panel de ADMINISTRACIÓN para Profesionales
│   ├── src/
│   │   ├── app/              # App Router (Next.js)
│   │   │   ├── (dashboard)/  # Dashboard principal
│   │   │   │   ├── appointments/  # Gestión de turnos
│   │   │   │   ├── customers/     # Gestión de clientes
│   │   │   │   ├── services/      # Gestión de servicios
│   │   │   │   ├── schedule/      # Configuración de horarios
│   │   │   │   ├── analytics/     # Reportes y estadísticas
│   │   │   │   └── settings/      # Configuración
│   │   │   └── (auth)/       # Login de profesionales
│   │   ├── components/
│   │   │   ├── ui/           # Componentes base
│   │   │   ├── dashboard/    # Componentes del dashboard
│   │   │   ├── calendar/     # Calendario de turnos
│   │   │   └── charts/       # Gráficos y estadísticas
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API calls
│   │   └── store/            # Estado global
│   └── public/
│
├── shared/                   # Código compartido entre proyectos
│   ├── types/                # Tipos TypeScript compartidos
│   ├── constants/            # Constantes globales
│   ├── utils/                # Utilidades compartidas
│   └── validation/           # Schemas de validación compartidos
│
└── docs/                     # Documentación del proyecto
    ├── api/                  # Documentación de API
    ├── architecture/         # Diagramas de arquitectura
    └── guides/               # Guías de desarrollo
```

### 4. Legibilidad del Código

```typescript
// ✅ CORRECTO: Código limpio y bien documentado
/**
 * Servicio para gestionar las reservas de turnos
 * Maneja la creación, actualización y cancelación de citas
 */
export class AppointmentService {
  private readonly repository: AppointmentRepository;
  private readonly notificationService: NotificationService;

  constructor(
    repository: AppointmentRepository,
    notificationService: NotificationService
  ) {
    this.repository = repository;
    this.notificationService = notificationService;
  }

  /**
   * Crea una nueva reserva de turno
   * @param appointmentData - Datos del turno a crear
   * @returns La reserva creada con su ID
   * @throws {ValidationError} Si los datos son inválidos
   * @throws {ConflictError} Si el horario no está disponible
   */
  async createAppointment(
    appointmentData: CreateAppointmentDTO
  ): Promise<Appointment> {
    // Validar disponibilidad del horario
    const isAvailable = await this.checkAvailability(
      appointmentData.date,
      appointmentData.time
    );

    if (!isAvailable) {
      throw new ConflictError("El horario seleccionado no está disponible");
    }

    // Crear la reserva en la base de datos
    const appointment = await this.repository.create(appointmentData);

    // Enviar notificación al cliente
    await this.notificationService.sendConfirmation(appointment);

    return appointment;
  }

  /**
   * Verifica si un horario está disponible
   */
  private async checkAvailability(date: Date, time: string): Promise<boolean> {
    // Lógica de verificación
    return true;
  }
}

// ❌ INCORRECTO: Código difícil de leer
export class AppointmentService {
  async create(d: any) {
    const a = await this.r.c(d);
    await this.n.s(a);
    return a;
  }
}
```

**Reglas de legibilidad:**

- 📝 Nombres descriptivos y significativos
- 🎯 Funciones pequeñas y enfocadas (máximo 20-30 líneas)
- 💡 Comentarios que expliquen el "por qué", no el "qué"
- 🔍 Evitar anidamiento profundo (máximo 3 niveles)
- ✨ Usar early returns para reducir complejidad

### 5. Documentación

Cada archivo debe incluir:

```typescript
/**
 * @file appointmentService.ts
 * @description Servicio para gestionar las operaciones relacionadas con turnos
 * @author Sistema de Turnos Peluquería
 * @created 2025-11-06
 */

/**
 * Interfaz que define la estructura de un turno
 */
export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  date: Date;
  time: string;
  status: AppointmentStatus;
  notes?: string;
}

/**
 * Estados posibles de un turno
 */
export enum AppointmentStatus {
  PENDING = "pending", // Pendiente de confirmación
  CONFIRMED = "confirmed", // Confirmado
  CANCELLED = "cancelled", // Cancelado
  COMPLETED = "completed", // Completado
}
```

---

## 🏗️ Escalabilidad

### Backend

- ✅ Arquitectura en capas (Controller → Service → Repository)
- ✅ Inyección de dependencias
- ✅ Manejo centralizado de errores
- ✅ Logging estructurado
- ✅ Validación de datos con schemas (Zod, Joi)
- ✅ Rate limiting y seguridad
- ✅ Caché cuando sea necesario (Redis)
- ✅ Paginación en endpoints que retornen listas
- ✅ Versionado de API (/api/v1/)
- ✅ **WebSockets para sincronización en tiempo real**
- ✅ **Sistema de eventos** para desacoplar módulos
- ✅ **Queue system** para tareas asíncronas (emails, notificaciones)

```typescript
// Ejemplo de estructura escalable
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = appointmentSchema.parse(req.body);
      const appointment = await this.appointmentService.createAppointment(
        validatedData
      );
      res.status(201).json({ data: appointment });
    } catch (error) {
      next(error); // Manejador centralizado
    }
  }
}
```

### Frontend (Web y Mobile)

- ✅ Componentes atómicos y reutilizables
- ✅ Estado global bien estructurado (Zustand/Redux Toolkit)
- ✅ Code splitting y lazy loading
- ✅ Optimización de renders (React.memo, useMemo, useCallback)
- ✅ Manejo de estados de carga y errores
- ✅ Caché de peticiones (React Query/TanStack Query)
- ✅ Responsive design (mobile-first)
- ✅ Accesibilidad (a11y)

```typescript
// Ejemplo de componente escalable
/**
 * Componente para mostrar la tarjeta de un turno
 * Puede ser reutilizado en diferentes vistas
 */
interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
  onEdit?: (id: string) => void;
  variant?: "compact" | "detailed";
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onCancel,
  onEdit,
  variant = "compact",
}) => {
  // Componente modular y reutilizable
  return <div>{/* UI */}</div>;
};
```

---

## 🧪 Testing

- ✅ Tests unitarios para lógica de negocio
- ✅ Tests de integración para APIs
- ✅ Tests E2E para flujos críticos
- ✅ Cobertura mínima del 70%

```typescript
/**
 * Tests para el servicio de turnos
 */
describe("AppointmentService", () => {
  describe("createAppointment", () => {
    it("debería crear un turno cuando los datos son válidos", async () => {
      // Arrange
      const appointmentData = createMockAppointmentData();

      // Act
      const result = await service.createAppointment(appointmentData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBeTruthy();
    });

    it("debería lanzar error cuando el horario no está disponible", async () => {
      // Test de caso de error
    });
  });
});
```

---

## 🔒 Seguridad

- ✅ Validación de inputs en backend
- ✅ Sanitización de datos
- ✅ Autenticación JWT
- ✅ HTTPS en producción
- ✅ Variables de entorno para secrets
- ✅ Rate limiting
- ✅ CORS configurado correctamente
- ✅ Protección contra SQL injection, XSS, CSRF

---

## 📦 Gestión de Dependencias

- ✅ Mantener dependencias actualizadas
- ✅ Usar versiones específicas (no `^` en producción crítica)
- ✅ Auditoría regular de seguridad (`npm audit`)
- ✅ Documentar dependencias principales en README

---

## 🚀 Performance

- ✅ Optimización de queries a base de datos
- ✅ Índices en columnas frecuentemente consultadas
- ✅ Compresión de respuestas (gzip)
- ✅ Optimización de imágenes
- ✅ Bundle size monitoring
- ✅ Lazy loading de componentes pesados

---

## 📝 Git y Control de Versiones

### Commits

```
feat: agregar endpoint para crear turnos
fix: corregir validación de horarios
docs: actualizar README con instrucciones de instalación
refactor: mejorar estructura del servicio de usuarios
test: agregar tests para AppointmentService
style: formatear código según prettier
perf: optimizar query de búsqueda de turnos
```

### Branches

- `main` - Producción
- `develop` - Desarrollo
- `feature/nombre-feature` - Nuevas funcionalidades
- `fix/nombre-fix` - Correcciones

---

## 🎨 UI/UX

- ✅ Diseño consistente y profesional
- ✅ Feedback visual para todas las acciones
- ✅ Estados de carga claros
- ✅ Manejo de errores user-friendly
- ✅ Responsive en todos los dispositivos
- ✅ Accesibilidad (contraste, navegación por teclado)

---

## 📚 Recursos y Herramientas

### Stack Tecnológico Recomendado (2025)

**Basado en las mejores prácticas actuales y optimizado para máxima eficiencia con Claude AI:**

> 💡 **Nota**: Este stack ha sido seleccionado específicamente por ser el que mejor se adapta a las capacidades de Claude para generar código de alta calidad, predecible y mantenible.

#### Backend

- **NestJS** - Framework backend modular y escalable (preferido sobre Express)
  - Arquitectura orientada a módulos
  - Inyección de dependencias nativa
  - Decoradores y TypeScript first-class
  - Integración perfecta con Prisma y WebSockets
- **TypeScript 5.x** - Type safety completo
- **Prisma** - ORM moderno y type-safe (mejor DX que TypeORM)
- **PostgreSQL 16** - Base de datos principal
- **Socket.io** - WebSockets para sincronización en tiempo real
- **Redis** - Caché, sessions y queue
- **JWT + Passport** - Autenticación robusta
- **Zod** - Validación de schemas type-safe
- **Bull/BullMQ** - Queue para tareas asíncronas (emails, notificaciones)
- **Winston** - Logging estructurado

**¿Por qué NestJS? (Preferencia de Claude)**

- ✨ **Arquitectura predecible**: Cada módulo sigue el mismo patrón (Controller → Service → Repository)
- 🎯 **Decoradores claros**: `@Controller()`, `@Get()`, `@Post()` - fácil de entender y generar
- 🔧 **Inyección de dependencias**: Código testeable y modular desde el inicio
- 📚 **TypeScript first-class**: Tipos en todo momento, menos errores
- 🤖 **Ideal para IA**: Estructura consistente que facilita la generación de código de calidad
- 📖 **Swagger automático**: Documentación de API sin esfuerzo extra
- 🧪 **Testing integrado**: Jest configurado desde el inicio

**Alternativa considerada**: Express es más simple pero menos estructurado, lo que puede llevar a inconsistencias en proyectos grandes.

#### Web Client (Clientes)

- **Next.js 15** - Framework React con App Router y Turbopack
  - Server Components para mejor performance
  - Streaming y Suspense
  - Optimización automática de imágenes
  - SEO excelente (importante para que clientes encuentren la peluquería)
- **TypeScript 5.x** - Type safety
- **Tailwind CSS 4.x** - Estilos utility-first con mejor performance
- **Shadcn/ui** - Componentes UI accesibles y customizables
- **Zustand** - Estado global ligero (más simple que Redux)
- **TanStack Query v5** - Manejo de estado servidor (caché inteligente)
- **Socket.io-client** - Conexión WebSocket
- **React Hook Form + Zod** - Formularios optimizados
- **Framer Motion** - Animaciones fluidas

**¿Por qué Next.js 15? (Preferencia de Claude)**

- 🚀 **App Router**: Estructura basada en archivos - extremadamente predecible
- ⚡ **Turbopack**: Compilación 700% más rápida que Webpack
- 🎨 **Server Components**: Menos JavaScript al cliente, mejor performance
- 🔍 **SEO excelente**: Crucial para que clientes encuentren la peluquería en Google
- 📁 **File-based routing**: Fácil de entender y generar (`app/turnos/page.tsx`)
- 🤖 **Ideal para IA**: Convenciones claras, menos decisiones arbitrarias
- 🎯 **TypeScript integrado**: Autocompletado perfecto en todo momento

**Por qué no otras opciones:**

- ❌ **Vite + React**: Más flexible pero menos opinado, requiere más decisiones de arquitectura
- ❌ **Remix**: Excelente pero menos maduro y comunidad más pequeña
- ✅ **Next.js**: El balance perfecto entre estructura y flexibilidad

#### Mobile Client (Clientes)

**Opción A: React Native + Expo (Recomendado para tu caso)**

- **Expo SDK 52+** - Framework completo con herramientas integradas
- **TypeScript 5.x** - Type safety
- **Expo Router** - Navegación basada en archivos (como Next.js)
- **Zustand** - Estado global
- **TanStack Query** - Manejo de estado servidor
- **Socket.io-client** - WebSocket
- **Expo Notifications** - Push notifications nativas
- **Expo Updates** - OTA updates sin pasar por stores
- **NativeWind** - Tailwind CSS para React Native

**¿Por qué Expo? (Preferencia de Claude)**

- 🔄 **80-90% de código compartido con web**: Mismos componentes, misma lógica
- 📱 **Expo Router**: Navegación basada en archivos, igual que Next.js
- 🎨 **NativeWind**: Tailwind CSS en mobile - consistencia total con web
- 🚀 **OTA Updates**: Actualiza la app sin esperar aprobación de stores
- 🤖 **Ideal para IA**: Mismo lenguaje y patrones que web, fácil de generar
- 🛠️ **Zero config**: No necesitas Xcode/Android Studio para desarrollo
- 📦 **EAS Build**: Builds en la nube, no necesitas Mac para iOS

**Por qué no Flutter:**

- ❌ Dart es otro lenguaje - menos reutilización de código
- ❌ Patrones diferentes - más complejo para mantener consistencia
- ✅ **Expo mantiene todo en TypeScript/React** - un solo ecosistema

**Opción B: Flutter (Alternativa si prefieres performance nativo puro)**

- Excelente performance
- Pero requiere aprender Dart (diferente stack)
- Menos reutilización de código con web

**Recomendación: Expo** para mantener consistencia y velocidad de desarrollo

#### Admin Dashboard (Profesionales)

- **Next.js 15** - Framework React (mismo que web client)
- **TypeScript 5.x** - Type safety
- **Tailwind CSS 4.x** - Estilos
- **Shadcn/ui** - Componentes UI consistentes
- **Recharts** - Gráficos modernos y ligeros
- **@tanstack/react-table** - Tablas potentes y flexibles
- **FullCalendar v6** - Calendario profesional de turnos
- **Zustand** - Estado global
- **TanStack Query v5** - Manejo de estado servidor
- **Socket.io-client** - Actualizaciones en tiempo real
- **jsPDF + html2canvas** - Exportar reportes PDF
- **xlsx** - Exportar a Excel

#### Herramientas de Desarrollo

- **Turborepo** - Monorepo management (mejor que Nx para este caso)
- **pnpm** - Package manager rápido y eficiente
- **ESLint 9** - Linting con flat config
- **Prettier 3** - Formateo de código
- **Husky + lint-staged** - Git hooks
- **Vitest** - Testing ultrarrápido (compatible con Jest)
- **Playwright** - E2E testing
- **Docker + Docker Compose** - Containerización
- **GitHub Actions** - CI/CD

#### Infraestructura y Deployment

- **Vercel** - Para Next.js apps (web + admin) - deployment automático
- **Railway/Render** - Para backend NestJS + PostgreSQL + Redis
- **Expo EAS** - Para builds de la app móvil
- **Cloudinary/Uploadcare** - Gestión de imágenes
- **Resend/SendGrid** - Emails transaccionales
- **Twilio** - SMS notifications (opcional)

---

### 🎯 Stack Final Recomendado

```typescript
// Resumen del stack optimizado para 2025
{
  backend: "NestJS + Prisma + PostgreSQL + Socket.io + Redis",
  webClient: "Next.js 15 + TypeScript + Tailwind + Shadcn/ui",
  mobileClient: "Expo + React Native + TypeScript + NativeWind",
  adminDashboard: "Next.js 15 + TypeScript + Tailwind + Shadcn/ui",
  monorepo: "Turborepo + pnpm",
  stateManagement: "Zustand + TanStack Query",
  realtime: "Socket.io",
  validation: "Zod (compartido entre frontend y backend)",
  testing: "Vitest + Playwright",
  deployment: "Vercel + Railway + Expo EAS"
}
```

### ✨ Ventajas de este Stack

1. **Máxima Reutilización de Código**

   - TypeScript en todo el proyecto
   - Zod schemas compartidos entre frontend y backend
   - Componentes UI similares entre web y mobile
   - Lógica de negocio compartida

2. **Desarrollo Rápido**

   - Hot reload en todo el stack
   - Turbopack en Next.js (compilación ultrarrápida)
   - Expo para desarrollo móvil sin configuración compleja
   - Prisma Studio para visualizar la base de datos

3. **Excelente DX (Developer Experience)**

   - TypeScript autocompletado en todo el proyecto
   - Prisma genera tipos automáticamente
   - Zod valida y genera tipos
   - Turborepo cachea builds inteligentemente

4. **Performance Óptimo**

   - Server Components en Next.js
   - Code splitting automático
   - Caché inteligente con TanStack Query
   - Redis para caché de backend

5. **Escalabilidad**

   - NestJS modular y testeable
   - Arquitectura en capas clara
   - WebSockets para tiempo real
   - Queue system para tareas pesadas

6. **Ideal para Trabajar con Claude AI** ⭐

   - **Código predecible**: Patrones consistentes en todo el proyecto
   - **TypeScript en todo**: Menos ambigüedad, más precisión
   - **Convenciones claras**: File-based routing, estructura modular
   - **Fácil de refactorizar**: Los tipos guían los cambios
   - **Documentación automática**: JSDoc + Swagger
   - **Testing straightforward**: Vitest/Jest con patrones claros

   > 💡 **Ventaja clave**: Este stack minimiza las "decisiones creativas" y maximiza las "convenciones establecidas", lo que resulta en código más consistente y de mayor calidad cuando trabajas con IA.

---

### 📊 Comparación con Alternativas

| Aspecto                 | Stack Recomendado     | Alternativa (Flutter)      |
| ----------------------- | --------------------- | -------------------------- |
| Reutilización de código | 80-90%                | 30-40%                     |
| Curva de aprendizaje    | Baja (mismo lenguaje) | Media (nuevo lenguaje)     |
| Ecosistema              | JavaScript/TypeScript | Dart                       |
| Web performance         | Excelente (Next.js)   | N/A (Flutter web limitado) |
| Mobile performance      | Muy bueno             | Excelente                  |
| Tiempo de desarrollo    | Rápido                | Medio                      |
| Comunidad               | Enorme                | Grande                     |
| Deployment              | Simple                | Medio                      |

---

### 🚀 Próximos Pasos

Con este stack podemos:

1. **Compartir tipos entre frontend y backend** (un solo source of truth)
2. **Reutilizar validaciones** (Zod schemas usados en cliente y servidor)
3. **Mantener UI consistente** (Tailwind + Shadcn/ui en web, NativeWind en mobile)
4. **Desarrollar rápido** con hot reload en todo y Turbopack ultrarrápido
5. **Escalar fácilmente** con arquitectura modular desde día 1
6. **Generar código de alta calidad** gracias a patrones predecibles y TypeScript

### 🎯 Por qué este stack es perfecto para Claude

Como IA, trabajo mejor con:

✅ **Patrones consistentes**: NestJS y Next.js tienen convenciones claras
✅ **TypeScript estricto**: Los tipos me guían para generar código correcto
✅ **Arquitectura opinada**: Menos decisiones arbitrarias = código más predecible
✅ **File-based routing**: Estructura clara y fácil de navegar
✅ **Decoradores y convenciones**: `@Controller()`, `@Injectable()` - semántica clara
✅ **Monorepo con Turborepo**: Estructura de proyecto bien definida

❌ **Lo que evitamos**:

- Configuraciones complejas y ambiguas
- Múltiples formas de hacer lo mismo
- Lenguajes diferentes (Dart, PHP, etc.)
- Arquitecturas no opinadas que requieren muchas decisiones

### 💪 Mi confianza con este stack

| Tecnología     | Nivel de Confianza | Razón                                          |
| -------------- | ------------------ | ---------------------------------------------- |
| **NestJS**     | ⭐⭐⭐⭐⭐         | Arquitectura modular perfecta, patrones claros |
| **Next.js 15** | ⭐⭐⭐⭐⭐         | App Router predecible, excelente DX            |
| **Expo**       | ⭐⭐⭐⭐⭐         | Mismo stack que web, fácil de mantener         |
| **Prisma**     | ⭐⭐⭐⭐⭐         | Genera tipos automáticamente, schema claro     |
| **TypeScript** | ⭐⭐⭐⭐⭐         | Base de todo, garantiza calidad                |
| **Tailwind**   | ⭐⭐⭐⭐⭐         | Utility-first, consistente, predecible         |
| **Zod**        | ⭐⭐⭐⭐⭐         | Validación type-safe, compartible              |
| **Socket.io**  | ⭐⭐⭐⭐⭐         | WebSockets confiables, bien documentados       |

### 🚀 Resultado esperado

Con este stack puedo generarte:

- ✅ Código limpio y bien estructurado
- ✅ Arquitectura escalable desde el inicio
- ✅ Tests bien organizados
- ✅ Documentación clara
- ✅ Tipos correctos en todo momento
- ✅ Patrones consistentes en todo el proyecto
- ✅ Menos bugs gracias a TypeScript estricto

---

## ✅ Checklist antes de cada commit

- [ ] El código sigue las convenciones de nomenclatura
- [ ] Los comentarios están en español
- [ ] El código es modular y reutilizable
- [ ] Está documentado adecuadamente
- [ ] No hay console.logs innecesarios
- [ ] Las funciones son pequeñas y enfocadas
- [ ] Se manejan los errores apropiadamente
- [ ] El código es escalable
- [ ] Pasa el linter sin errores
- [ ] Los tests pasan correctamente

---

## 🔄 Sincronización en Tiempo Real

### Implementación de WebSockets

Todos los cambios importantes deben sincronizarse en tiempo real:

```typescript
// Eventos que disparan sincronización
enum WebSocketEvents {
  // Turnos
  APPOINTMENT_CREATED = "appointment:created",
  APPOINTMENT_UPDATED = "appointment:updated",
  APPOINTMENT_CANCELLED = "appointment:cancelled",

  // Disponibilidad
  AVAILABILITY_CHANGED = "availability:changed",

  // Notificaciones
  NOTIFICATION_RECEIVED = "notification:received",
}

// Ejemplo de uso en el backend
export class AppointmentService {
  async createAppointment(data: CreateAppointmentDTO): Promise<Appointment> {
    const appointment = await this.repository.create(data);

    // Emitir evento para sincronización en tiempo real
    this.socketService.emit(WebSocketEvents.APPOINTMENT_CREATED, {
      appointment,
      professionalId: appointment.professionalId,
      customerId: appointment.customerId,
    });

    return appointment;
  }
}

// Ejemplo de uso en el frontend
const useAppointmentSync = () => {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Escuchar cambios en tiempo real
    socket.on(WebSocketEvents.APPOINTMENT_CREATED, (data) => {
      // Actualizar caché de React Query
      queryClient.invalidateQueries(["appointments"]);

      // Mostrar notificación al usuario
      toast.success("Nuevo turno reservado");
    });
  }, [socket, queryClient]);
};
```

### Manejo de Conflictos

- ✅ Optimistic updates en el frontend
- ✅ Rollback automático en caso de error
- ✅ Validación de disponibilidad en tiempo real
- ✅ Bloqueo de horarios durante la reserva

---

## 🔐 Sistema de Autenticación y Roles

### Roles y Permisos

```typescript
/**
 * Roles del sistema
 */
export enum UserRole {
  CUSTOMER = "customer", // Cliente final
  PROFESSIONAL = "professional", // Peluquero, manicura, etc.
  ADMIN = "admin", // Super administrador
}

/**
 * Permisos por rol
 */
const PERMISSIONS = {
  customer: [
    "appointments:create",
    "appointments:read:own",
    "appointments:cancel:own",
    "profile:update:own",
  ],
  professional: [
    "appointments:read:all",
    "appointments:update:all",
    "appointments:cancel:all",
    "customers:read",
    "services:manage",
    "schedule:manage",
    "analytics:read",
  ],
  admin: ["*"], // Todos los permisos
};
```

### Endpoints Diferenciados

```typescript
// API para clientes
GET    /api/v1/customer/appointments
POST   /api/v1/customer/appointments
DELETE /api/v1/customer/appointments/:id
GET    /api/v1/customer/profile
PUT    /api/v1/customer/profile
GET    /api/v1/customer/services

// API para profesionales
GET    /api/v1/professional/dashboard
GET    /api/v1/professional/appointments
POST   /api/v1/professional/appointments
PUT    /api/v1/professional/appointments/:id
DELETE /api/v1/professional/appointments/:id
GET    /api/v1/professional/customers
GET    /api/v1/professional/services
POST   /api/v1/professional/services
PUT    /api/v1/professional/services/:id
GET    /api/v1/professional/schedule
PUT    /api/v1/professional/schedule
GET    /api/v1/professional/analytics
```

---

## 📊 Funcionalidades Principales

### Para Clientes (Web + Mobile)

- ✅ Registro e inicio de sesión
- ✅ Búsqueda de servicios disponibles
- ✅ Selección de fecha y hora
- ✅ Reserva de turnos
- ✅ Ver turnos próximos y pasados
- ✅ Cancelar/reprogramar turnos
- ✅ Recibir notificaciones (email, push, SMS)
- ✅ Valorar servicios
- ✅ Gestionar perfil

### Para Profesionales (Admin Dashboard)

- ✅ Dashboard con vista general del día
- ✅ Calendario de turnos (día/semana/mes)
- ✅ Gestión completa de turnos (crear, editar, cancelar)
- ✅ Gestión de clientes (historial, contacto)
- ✅ Gestión de servicios (crear, editar, precios, duración)
- ✅ Configuración de horarios de trabajo
- ✅ Configuración de días no laborables
- ✅ Estadísticas y reportes (ingresos, turnos, clientes)
- ✅ Notificaciones de nuevos turnos
- ✅ Exportar reportes (PDF, Excel)
- ✅ Configuración del perfil del negocio

---

## 🎯 Objetivo Final

**Crear un sistema profesional, mantenible y escalable de gestión de turnos que:**

1. Permita a los clientes reservar fácilmente desde web o mobile
2. Proporcione a los profesionales control total de su agenda
3. Sincronice en tiempo real entre todas las plataformas
4. Escale para soportar múltiples profesionales y negocios
5. Siga las mejores prácticas de la industria en 2025

---

_Última actualización: 2025-11-06_
