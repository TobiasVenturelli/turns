# ✅ Fase 0 - Configuración Inicial del Monorepo

**Estado**: COMPLETADA  
**Fecha**: 7 de noviembre de 2025

---

## 📋 ¿Qué se hizo?

Se configuró la estructura base del monorepo con:

- **Turborepo** + **pnpm workspaces** (gestión del monorepo)
- **TypeScript 5.3** (configuración estricta global)
- **ESLint** + **Prettier** (linting y formato automático)
- **Husky** + **lint-staged** (git hooks para calidad de código)
- **Docker Compose** (PostgreSQL 16 + Redis 7 + pgAdmin + Redis Commander)
- Estructura de carpetas: `/apps` y `/packages`
- Variables de entorno (`env.example`)
- Scripts npm para desarrollo, build, testing y linting

---

## ⚙️ Requisitos - Lo que debes tener instalado

Antes de continuar con la Fase 1, asegúrate de tener:

### Obligatorio:
- **Node.js** >= 20.0.0
- **pnpm** >= 8.0.0
- **PostgreSQL** >= 16 (o usar Docker)
- **Docker** + **Docker Compose** (recomendado)

### Verificar instalación:
```bash
node --version    # >= 20.0.0
pnpm --version    # >= 8.0.0
docker --version  # Cualquier versión reciente
```

### Si no tienes pnpm:
```bash
npm install -g pnpm
```

---

## 🚀 Cómo empezar

### 1. Instalar dependencias del monorepo
```bash
pnpm install
```

### 2. Configurar variables de entorno
```bash
cp env.example .env
# Editar .env y configurar al menos:
# - DATABASE_URL (PostgreSQL)
# - JWT_ACCESS_SECRET y JWT_REFRESH_SECRET
```

### 3. Iniciar servicios de base de datos
```bash
# Opción A: Con Docker (recomendado)
docker-compose up -d

# Opción B: Si ya tienes PostgreSQL local
# Crear base de datos: createdb turns_db
```

### 4. Verificar que todo funciona
```bash
pnpm lint
pnpm type-check
```

---

## 📌 Importante tener en cuenta

1. **Git hooks**: Cada commit ejecutará automáticamente linting y formato
2. **Commits en español**: `feat:`, `fix:`, `docs:`, etc.
3. **Código en inglés**: Variables, funciones, clases en inglés
4. **Comentarios en español**: Documentación y comentarios en español
5. **Carpeta `contexto/`**: NO modificar, NO mover, NO subir a git (4 archivos de referencia del proyecto)

---

## 🎯 Lo que sigue - FASE 1: Backend Base

**Objetivo**: Crear el backend con NestJS y sistema de autenticación

**Tareas principales:**
1. Crear proyecto NestJS en `/apps/backend`
2. Configurar Prisma ORM + PostgreSQL
3. Implementar autenticación con JWT
4. Implementar Google OAuth 2.0
5. Crear módulo de usuarios
6. Documentar API con Swagger

**Tiempo estimado**: 12-15 horas

**Ver plan detallado**: [contexto/WORKFLOW_V1.md](./contexto/WORKFLOW_V1.md)

---

## 📚 Documentación de referencia

Toda la documentación importante está en la carpeta `/contexto`:

- **DEVELOPMENT_RULES.md** - Reglas de desarrollo (nomenclatura, arquitectura, etc.)
- **FEATURES.md** - Funcionalidades completas del sistema
- **PAYMENT_FLOWS.md** - Integración con Mercado Pago
- **WORKFLOW_V1.md** - Plan de desarrollo fase por fase

---

## 🎮 Scripts útiles

```bash
# Desarrollo
pnpm dev              # Iniciar todos los proyectos
pnpm dev:backend      # Solo backend
pnpm dev:web          # Solo web client
pnpm dev:admin        # Solo admin dashboard

# Testing y calidad
pnpm test             # Ejecutar tests
pnpm lint             # Ejecutar linter
pnpm lint:fix         # Corregir errores automáticamente
pnpm format           # Formatear código

# Docker
docker-compose up -d      # Iniciar servicios
docker-compose logs -f    # Ver logs
docker-compose down       # Detener servicios
```

---

**✅ Fase 0: COMPLETADA**  
**➡️ Siguiente: Fase 1 - Backend Base (NestJS)**

