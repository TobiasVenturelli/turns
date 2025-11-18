# 🖥️ Guía: Configurar Proyecto Turns en Nueva PC

**Última actualización**: 18 de Noviembre, 2025

Esta guía te ayudará a clonar y configurar el proyecto completo en tu PC personal.

---

## 📋 Requisitos Previos

### 1. Software Necesario

Instala lo siguiente en tu PC personal:

#### ✅ Node.js (v20 o superior)

- Descargar: https://nodejs.org/
- Recomendado: v20 LTS o superior
- Verificar: `node --version`

#### ✅ pnpm (v8 o superior)

```bash
npm install -g pnpm
```

- Verificar: `pnpm --version`

#### ✅ Git

- Descargar: https://git-scm.com/
- Verificar: `git --version`

#### ✅ PostgreSQL (Local - Opcional)

- **Opción A**: Usar PostgreSQL local
  - Descargar: https://www.postgresql.org/download/
  - Instalar y crear base de datos `turns_dev`
- **Opción B**: Usar base de datos en Render (Recomendado para empezar)
  - Ya está configurada en producción
  - Solo necesitas las credenciales

#### 🎯 WSL2 (Recomendado para Windows)

```powershell
# En PowerShell como Administrador
wsl --install
```

- Reinicia tu PC después de instalar
- Configura usuario y contraseña de Ubuntu
- Instala Node.js y pnpm dentro de WSL

---

## 🚀 Pasos de Instalación

### PASO 1: Clonar el Repositorio

```bash
# Opción A: HTTPS
git clone https://github.com/TobiasVenturelli/turns.git
cd turns

# Opción B: SSH (si tienes SSH configurado)
git clone git@github.com:TobiasVenturelli/turns.git
cd turns
```

---

### PASO 2: Instalar Dependencias

```bash
# Instalar todas las dependencias del monorepo
pnpm install
```

Este comando instalará las dependencias de:

- Backend (NestJS)
- Admin Dashboard (Next.js)
- Web Client (Next.js)
- Landing (Next.js)

**Tiempo estimado**: 2-5 minutos

---

### PASO 3: Configurar Variables de Entorno

#### 3.1 Backend

Crea el archivo `.env` en `apps/backend/`:

```bash
# Navegar a la carpeta del backend
cd apps/backend

# Crear archivo .env
touch .env  # En Linux/Mac/WSL
# O crear manualmente en Windows
```

**Contenido del archivo `apps/backend/.env`**:

```env
# ===========================================
# DATABASE
# ===========================================
DATABASE_URL="postgresql://usuario:password@localhost:5432/turns_dev"
# O usar la de producción (Render):
# DATABASE_URL="postgresql://turns_user:PASSWORD@dpg-xxxxx.oregon-postgres.render.com/turns_db"

# ===========================================
# JWT
# ===========================================
JWT_SECRET="tu-secret-super-seguro-cambialo"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="otro-secret-diferente-para-refresh"
JWT_REFRESH_EXPIRES_IN="30d"

# ===========================================
# GOOGLE OAUTH (Opcional para empezar)
# ===========================================
GOOGLE_CLIENT_ID="tu-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/api/v1/auth/google/callback"

# ===========================================
# MERCADO PAGO (Opcional para empezar)
# ===========================================
MERCADOPAGO_ACCESS_TOKEN="tu-access-token-de-mercadopago"
MERCADOPAGO_PUBLIC_KEY="tu-public-key-de-mercadopago"

# ===========================================
# CORS
# ===========================================
CORS_ORIGIN="http://localhost:3001,http://localhost:3002,http://localhost:3003"

# ===========================================
# URLS
# ===========================================
FRONTEND_URL="http://localhost:3001"
ADMIN_URL="http://localhost:3002"
API_URL="http://localhost:3000"

# ===========================================
# EMAIL (Opcional - para notificaciones)
# ===========================================
EMAIL_SERVICE="gmail"
EMAIL_USER="tu-email@gmail.com"
EMAIL_PASSWORD="tu-app-password"

# ===========================================
# NODE ENV
# ===========================================
NODE_ENV="development"
PORT=3000
```

#### 3.2 Admin Dashboard

Crea el archivo `.env.local` en `apps/admin-dashboard/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

#### 3.3 Web Client

Crea el archivo `.env.local` en `apps/web-client/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

#### 3.4 Landing

No necesita variables de entorno.

---

### PASO 4: Configurar Base de Datos

#### Opción A: PostgreSQL Local

```bash
# Desde apps/backend/

# 1. Generar cliente de Prisma
pnpm prisma:generate

# 2. Ejecutar migraciones
pnpm prisma:migrate

# 3. Ejecutar seed (datos de prueba)
pnpm prisma:seed
```

#### Opción B: Usar Base de Datos de Producción (Render)

Si usas la base de datos de Render, **NO ejecutes migraciones** (ya están aplicadas).

Solo genera el cliente:

```bash
pnpm prisma:generate
```

---

### PASO 5: Levantar el Proyecto

Tienes dos opciones:

#### Opción A: Levantar Todo (Recomendado)

Desde la raíz del proyecto:

```bash
pnpm dev
```

Esto levantará:

- ✅ Backend: http://localhost:3000
- ✅ Web Client: http://localhost:3001
- ✅ Admin Dashboard: http://localhost:3002
- ✅ Landing: http://localhost:3003

#### Opción B: Levantar Individualmente

```bash
# Backend
pnpm dev:backend

# Web Client
pnpm dev:web

# Admin Dashboard
pnpm dev:admin

# Landing (si lo necesitas)
cd apps/landing && pnpm dev
```

---

## ✅ Verificación

### 1. Backend Funcionando

Abre: http://localhost:3000/api/v1

Deberías ver:

```json
{
  "status": "ok",
  "message": "Turns API is running",
  "version": "1.0.0",
  "timestamp": "..."
}
```

### 2. Admin Dashboard Funcionando

Abre: http://localhost:3002

Deberías ver la página de login.

**Credenciales de prueba**:

```
Email: profesional@test.com
Password: Password123!
```

### 3. Web Client Funcionando

Abre: http://localhost:3001/peluqueria-maria

Deberías ver la página del negocio de prueba.

---

## 🗄️ Datos de Prueba (Seed)

Si ejecutaste el seed, tienes estos datos disponibles:

### Usuario Cliente

```
Email: cliente@test.com
Password: Password123!
```

### Usuario Profesional

```
Email: profesional@test.com
Password: Password123!
Negocio: Peluquería María
Slug: peluqueria-maria
Suscripción: TRIAL (7 días)
```

### Servicios del Negocio

- Corte de Pelo ($5,000 ARS - 30 min)
- Coloración ($15,000 ARS - 90 min)
- Manicura ($3,500 ARS - 45 min)
- Pedicura ($4,000 ARS - 60 min)

---

## 🐛 Solución de Problemas

### Error: "Cannot find module '@prisma/client'"

```bash
cd apps/backend
pnpm prisma:generate
```

### Error: "Port 3000 already in use"

Mata el proceso que está usando el puerto:

**Windows**:

```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Linux/Mac/WSL**:

```bash
lsof -ti:3000 | xargs kill -9
```

### Error: "DATABASE_URL is not defined"

Verifica que el archivo `.env` existe en `apps/backend/` y tiene la variable `DATABASE_URL`.

### Error: "pnpm: command not found"

Instala pnpm:

```bash
npm install -g pnpm
```

### Error al instalar dependencias

Limpia caché y reinstala:

```bash
# Limpiar todo
pnpm clean

# Reinstalar
pnpm install
```

---

## 📚 Documentación Importante

Una vez clonado el proyecto, revisa estos archivos:

- 📊 `contexto/ESTADO_ACTUAL_PROYECTO.md` - Estado actual y pendientes
- 🎨 `contexto/FEATURES.md` - Funcionalidades del sistema
- 💰 `contexto/PAYMENT_FLOWS.md` - Flujos de pago
- 🔧 `contexto/DEVELOPMENT_RULES.md` - Reglas de desarrollo
- 🚀 `VERCEL_DEPLOYMENT.md` - Guía de despliegue

---

## 🎯 Próximos Pasos

1. ✅ Clonar repositorio
2. ✅ Instalar dependencias
3. ✅ Configurar variables de entorno
4. ✅ Levantar proyecto localmente
5. ✅ Probar funcionalidades
6. 🚀 Continuar desarrollo

---

## 💡 Consejos

### Usar WSL en Windows

Si estás en Windows, **usa WSL2** para desarrollo:

1. Todo será más rápido
2. Comandos Unix funcionan nativamente
3. Mejor compatibilidad con herramientas de desarrollo

### Usar VS Code

Extensiones recomendadas:

- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- GitLens

### Usar Git correctamente

```bash
# Crear rama para nueva feature
git checkout -b feature/nombre-feature

# Hacer commits descriptivos
git commit -m "feat: descripción del cambio"

# Push a tu rama
git push origin feature/nombre-feature
```

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:

1. Revisa la sección "Solución de Problemas" arriba
2. Revisa los logs de error completos
3. Verifica que todas las variables de entorno estén configuradas
4. Asegúrate de tener las versiones correctas de Node.js y pnpm

---

_Última actualización: 18 de Noviembre, 2025_  
_Versión: 1.0_
