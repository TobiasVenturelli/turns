# ✅ Fase 1 - Backend Base (API)

**Estado**: COMPLETADA  
**Fecha**: 7 de noviembre de 2025  
**Tiempo**: ~12 horas

---

## 📋 ¿Qué se hizo?

Se creó el backend completo con NestJS, incluyendo:

### 1. Proyecto NestJS Configurado

- ✅ Servidor corriendo en `http://localhost:3000`
- ✅ Prefijo global de API: `/api/v1`
- ✅ CORS configurado
- ✅ Validación global con `class-validator`
- ✅ Rate limiting (100 requests/minuto)
- ✅ Variables de entorno configuradas
- ✅ TypeScript en modo estricto

### 2. Base de Datos y Prisma

- ✅ PostgreSQL 16 conectado (Docker)
- ✅ Prisma ORM configurado
- ✅ Schema completo con 5 modelos:
  - `User` - Usuarios (clientes y profesionales)
  - `Business` - Negocios/Peluquerías
  - `Service` - Servicios ofrecidos
  - `Schedule` - Horarios de trabajo
  - `Appointment` - Turnos/Citas
- ✅ Migración inicial aplicada
- ✅ Seeds con datos de prueba

### 3. Sistema de Autenticación

- ✅ JWT (access + refresh tokens)
- ✅ Registro de usuarios
- ✅ Login con email/password
- ✅ Refresh tokens
- ✅ Logout
- ✅ Guards de autenticación
- ✅ Decoradores personalizados (`@Public()`, `@CurrentUser()`)

### 4. Módulo de Usuarios

- ✅ Gestión de perfil
- ✅ Actualización de datos
- ✅ Cambio de contraseña
- ✅ Eliminación de cuenta

---

## 🚀 Endpoints Disponibles

### Health Check

```
GET  /api/v1          # Estado de la API
```

### Autenticación

```
POST /api/v1/auth/register       # Registrar usuario
POST /api/v1/auth/login          # Iniciar sesión
POST /api/v1/auth/refresh        # Refrescar tokens
POST /api/v1/auth/logout         # Cerrar sesión
GET  /api/v1/auth/me             # Usuario actual
```

### Usuarios

```
GET    /api/v1/users/profile     # Obtener perfil
PUT    /api/v1/users/profile     # Actualizar perfil
PUT    /api/v1/users/password    # Cambiar contraseña
DELETE /api/v1/users/account     # Eliminar cuenta
```

---

## 💾 Datos de Prueba

### Usuario Cliente

```
Email: cliente@test.com
Password: Password123!
Rol: CUSTOMER
```

### Usuario Profesional

```
Email: profesional@test.com
Password: Password123!
Rol: PROFESSIONAL
Negocio: Peluquería María
```

---

## 📁 Estructura del Backend

```
apps/backend/
├── src/
│   ├── main.ts                   # Punto de entrada
│   ├── app.module.ts             # Módulo raíz
│   ├── app.controller.ts         # Health check
│   ├── app.service.ts            # Health check service
│   ├── prisma/
│   │   ├── prisma.service.ts     # Servicio de Prisma
│   │   └── prisma.module.ts      # Módulo global de Prisma
│   ├── auth/
│   │   ├── auth.module.ts        # Módulo de autenticación
│   │   ├── auth.service.ts       # Lógica de autenticación
│   │   ├── auth.controller.ts    # Endpoints de auth
│   │   ├── dto/                  # DTOs de auth
│   │   ├── strategies/           # Estrategias JWT
│   │   ├── guards/               # Guards de autenticación
│   │   └── decorators/           # Decoradores personalizados
│   └── users/
│       ├── users.module.ts       # Módulo de usuarios
│       ├── users.service.ts      # Lógica de usuarios
│       ├── users.controller.ts   # Endpoints de usuarios
│       └── dto/                  # DTOs de usuarios
├── prisma/
│   ├── schema.prisma             # Schema de la BD
│   ├── seed.ts                   # Datos de prueba
│   └── migrations/               # Migraciones
├── .env                          # Variables de entorno
└── package.json                  # Dependencias
```

---

## 🔧 Dependencias Instaladas

### Producción

- `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`
- `@nestjs/config` - Variables de entorno
- `@nestjs/jwt`, `@nestjs/passport` - Autenticación
- `@nestjs/throttler` - Rate limiting
- `@prisma/client` - ORM para PostgreSQL
- `passport`, `passport-jwt` - Estrategias de autenticación
- `bcrypt` - Hash de contraseñas
- `class-validator`, `class-transformer` - Validación
- `zod` - Schema validation

### Desarrollo

- `prisma` - CLI de Prisma
- `@types/bcrypt`, `@types/passport-jwt` - Tipos TypeScript
- `ts-node` - Ejecución de TypeScript
- `eslint`, `prettier` - Linting y formato

---

## 📌 Importante tener en cuenta

### Seguridad

1. **JWT Secrets**: Cambiar en producción los valores de `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET` en `.env`
2. **Contraseñas**: Todas hasheadas con bcrypt (salt rounds: 10)
3. **Tokens**: Access token expira en 15min, Refresh token en 7 días
4. **Rate Limiting**: 100 requests por minuto por IP

### Base de Datos

1. **PostgreSQL**: Corriendo en Docker (puerto 5432)
2. **Prisma Studio**: `cd apps/backend && pnpm prisma:studio` para ver los datos
3. **Migraciones**: `cd apps/backend && pnpm prisma:migrate` para crear nuevas
4. **Seed**: `cd apps/backend && pnpm prisma:seed` para recargar datos de prueba

### Autenticación

1. **Rutas protegidas**: Por defecto todas las rutas requieren autenticación
2. **Rutas públicas**: Usar decorador `@Public()` para rutas sin auth
3. **Usuario actual**: Usar decorador `@CurrentUser()` para obtener el usuario autenticado
4. **Headers**: Enviar token en header `Authorization: Bearer <token>`

---

## 🚀 Cómo ejecutar

### 1. Asegurarse de que Docker esté corriendo

```bash
docker ps
# Debe mostrar: turns-postgres, turns-redis, turns-pgadmin, turns-redis-commander
```

### 2. Instalar dependencias (si no está hecho)

```bash
cd apps/backend
pnpm install
```

### 3. Configurar variables de entorno

```bash
# El archivo .env ya debe estar creado con:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/turns_db?schema=public
JWT_ACCESS_SECRET=dev-secret-access-key-change-in-production
JWT_REFRESH_SECRET=dev-secret-refresh-key-change-in-production
```

### 4. Aplicar migraciones (si es necesario)

```bash
cd apps/backend
pnpm prisma:migrate
```

### 5. Cargar datos de prueba (opcional)

```bash
cd apps/backend
pnpm prisma:seed
```

### 6. Iniciar el servidor

```bash
cd apps/backend
pnpm dev
```

El servidor estará disponible en: `http://localhost:3000`

---

## 🧪 Probar los endpoints

### Ejemplo de registro

```bash
POST http://localhost:3000/api/v1/auth/register
Content-Type: application/json

{
  "email": "nuevo@test.com",
  "password": "Password123!",
  "firstName": "Nuevo",
  "lastName": "Usuario",
  "phone": "+54911111111",
  "role": "CUSTOMER"
}
```

### Ejemplo de login

```bash
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "cliente@test.com",
  "password": "Password123!"
}

# Respuesta incluye:
# - accessToken
# - refreshToken
# - user (datos del usuario)
```

### Ejemplo de obtener perfil (requiere token)

```bash
GET http://localhost:3000/api/v1/users/profile
Authorization: Bearer <tu_access_token>
```

---

## 🐛 Solución de problemas

### Error: Cannot connect to database

```bash
# Verificar que Docker esté corriendo
docker ps

# Si no está, iniciar los servicios
cd ../..  # Ir a la raíz del proyecto
docker-compose up -d
```

### Error: Prisma Client not generated

```bash
cd apps/backend
pnpm prisma:generate
```

### Error: Port 3000 already in use

```bash
# Cambiar el puerto en .env
PORT=3001
```

### Ver logs de Prisma

```bash
# En apps/backend/.env agregar:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/turns_db?schema=public&connection_limit=5&pool_timeout=10"
```

---

## 📊 Próxima Fase

### **FASE 2: Frontend Web Client (Clientes)**

**Objetivo**: Crear la aplicación web para que los clientes reserven turnos

**Tareas principales:**

1. Crear proyecto Next.js 15 en `/apps/web-client`
2. Configurar Tailwind CSS + Shadcn/ui
3. Implementar sistema de autenticación (frontend)
4. Crear página pública del negocio
5. Implementar flujo de reserva de turnos
6. Integrar con backend API

**Tiempo estimado**: 20-25 horas

**Ver plan detallado**: [contexto/WORKFLOW_V1.md](./contexto/WORKFLOW_V1.md)

---

## 📚 Comandos útiles

```bash
# Desarrollo
cd apps/backend
pnpm dev              # Iniciar servidor en modo watch

# Base de datos
pnpm prisma:studio    # Abrir Prisma Studio
pnpm prisma:migrate   # Crear nueva migración
pnpm prisma:seed      # Recargar datos de prueba
pnpm prisma:generate  # Regenerar Prisma Client

# Testing
pnpm test             # Ejecutar tests
pnpm test:watch       # Tests en modo watch
pnpm test:coverage    # Tests con cobertura

# Calidad de código
pnpm lint             # Ejecutar linter
pnpm format           # Formatear código
pnpm type-check       # Verificar tipos TypeScript
```

---

**✅ Fase 1: COMPLETADA**  
**➡️ Siguiente: Fase 2 - Frontend Web Client**
