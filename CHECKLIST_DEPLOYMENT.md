# ✅ Checklist de Deployment - Proyecto Turns

**Fecha**: 14 de Noviembre, 2025  
**Estado**: Frontend desplegado en Vercel ✅

---

## 🎯 Resumen del Estado Actual

### ✅ Completado:

- [x] Frontend desplegado en Vercel (según usuario)

### ⏳ Pendiente:

- [ ] Backend desplegado
- [ ] Base de datos de producción
- [ ] Variables de entorno configuradas
- [ ] WebSockets funcionando en producción
- [ ] Verificaciones finales

---

## 📋 Checklist Completo de Deployment

### 1️⃣ Frontend - Vercel ✅ (Ya desplegado)

#### Web Client (`apps/web-client`)

- [x] Proyecto importado en Vercel
- [ ] **Verificar**: Root directory configurado como `apps/web-client`
- [ ] **Verificar**: Framework configurado como Next.js
- [ ] **Verificar**: Variables de entorno configuradas:
  - [ ] `NEXT_PUBLIC_API_URL` → URL del backend en producción
  - [ ] `NEXT_PUBLIC_WEB_URL` → URL del web client en Vercel
  - [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` → Google OAuth de producción
- [ ] **Verificar**: Deploy automático en push a main
- [ ] **Verificar**: Dominio personalizado (opcional)

#### Admin Dashboard (`apps/admin-dashboard`)

- [x] Proyecto importado en Vercel
- [ ] **Verificar**: Root directory configurado como `apps/admin-dashboard`
- [ ] **Verificar**: Framework configurado como Next.js
- [ ] **Verificar**: Variables de entorno configuradas:
  - [ ] `NEXT_PUBLIC_API_URL` → URL del backend en producción
  - [ ] `NEXT_PUBLIC_ADMIN_URL` → URL del admin dashboard en Vercel
  - [ ] `NEXT_PUBLIC_WS_URL` → URL del backend para WebSockets
  - [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` → Google OAuth de producción
- [ ] **Verificar**: Deploy automático en push a main
- [ ] **Verificar**: Dominio personalizado (opcional)

#### Landing Page (`apps/landing`)

- [ ] **Opcional**: Desplegar landing page en Vercel
- [ ] **Verificar**: Variables de entorno si es necesario

---

### 2️⃣ Backend - Railway/Render ⚠️ CRÍTICO

#### Opción A: Railway (Recomendado)

- [ ] Crear cuenta en Railway: https://railway.app
- [ ] Crear nuevo proyecto
- [ ] Conectar repositorio de GitHub
- [ ] Crear nuevo servicio (Backend)
- [ ] Configurar:
  - [ ] **Build Command**: `pnpm install && pnpm build --filter backend`
  - [ ] **Start Command**: `pnpm start --filter backend`
  - [ ] **Root Directory**: `apps/backend` (si aplica)
- [ ] Agregar PostgreSQL addon:
  - [ ] Crear PostgreSQL database
  - [ ] Copiar `DATABASE_URL` generada
- [ ] Agregar Redis addon (opcional, para caché):
  - [ ] Crear Redis instance
  - [ ] Copiar `REDIS_URL` generada
- [ ] Configurar variables de entorno:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3000` (Railway lo asigna automáticamente)
  - [ ] `DATABASE_URL` → URL de PostgreSQL de Railway
  - [ ] `JWT_SECRET` → Generar secreto seguro (usar: `openssl rand -base64 32`)
  - [ ] `JWT_REFRESH_SECRET` → Generar otro secreto seguro
  - [ ] `MERCADOPAGO_*` → Credenciales de producción
  - [ ] `GOOGLE_CLIENT_ID` → OAuth de producción
  - [ ] `GOOGLE_CLIENT_SECRET` → OAuth de producción
  - [ ] `GOOGLE_CALLBACK_URL` → `https://tu-backend.railway.app/api/v1/auth/google/callback`
  - [ ] `WEB_URL` → URL del web client en Vercel
  - [ ] `ADMIN_URL` → URL del admin dashboard en Vercel
  - [ ] `CORS_ORIGINS` → URLs de Vercel separadas por comas
- [ ] Ejecutar migraciones de Prisma:
  ```bash
  pnpm prisma migrate deploy --schema=apps/backend/prisma/schema.prisma
  ```
- [ ] Ejecutar seeds (planes de suscripción):
  ```bash
  pnpm prisma db seed --schema=apps/backend/prisma/schema.prisma
  ```
- [ ] Configurar dominio personalizado (opcional)
- [ ] Verificar que el backend esté funcionando:
  - [ ] Probar endpoint: `GET https://tu-backend.railway.app/api/v1/health` (si existe)
  - [ ] Verificar logs en Railway

#### Opción B: Render

- [ ] Crear cuenta en Render: https://render.com
- [ ] Crear nuevo Web Service
- [ ] Conectar repositorio de GitHub
- [ ] Configurar:
  - [ ] **Build Command**: `pnpm install && pnpm build --filter backend`
  - [ ] **Start Command**: `pnpm start --filter backend`
  - [ ] **Root Directory**: `apps/backend`
- [ ] Crear PostgreSQL database
- [ ] Crear Redis instance (opcional)
- [ ] Configurar variables de entorno (mismas que Railway)
- [ ] Ejecutar migraciones y seeds
- [ ] Configurar dominio personalizado

---

### 3️⃣ Base de Datos de Producción ⚠️ CRÍTICO

- [ ] Crear base de datos PostgreSQL (Railway/Render/Supabase)
- [ ] Ejecutar migraciones:
  ```bash
  cd apps/backend
  pnpm prisma migrate deploy
  ```
- [ ] Ejecutar seeds (planes de suscripción):
  ```bash
  cd apps/backend
  pnpm prisma db seed
  ```
- [ ] Verificar que las tablas se crearon correctamente
- [ ] Configurar backups automáticos (si el proveedor lo permite)

---

### 4️⃣ Variables de Entorno de Producción ⚠️ CRÍTICO

#### Backend (Railway/Render)

**Variables obligatorias:**

- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL` → URL de PostgreSQL de producción
- [ ] `JWT_SECRET` → Secreto seguro generado
- [ ] `JWT_REFRESH_SECRET` → Secreto seguro generado
- [ ] `MERCADOPAGO_CLIENT_ID` → Credenciales de producción
- [ ] `MERCADOPAGO_CLIENT_SECRET` → Credenciales de producción
- [ ] `MERCADOPAGO_ACCESS_TOKEN` → Token de producción
- [ ] `GOOGLE_CLIENT_ID` → OAuth de producción
- [ ] `GOOGLE_CLIENT_SECRET` → OAuth de producción
- [ ] `GOOGLE_CALLBACK_URL` → URL de callback de producción
- [ ] `WEB_URL` → URL del web client en Vercel
- [ ] `ADMIN_URL` → URL del admin dashboard en Vercel
- [ ] `CORS_ORIGINS` → URLs permitidas separadas por comas

**Variables opcionales:**

- [ ] `REDIS_URL` → Si usas Redis para caché
- [ ] `SENDGRID_API_KEY` → Para emails
- [ ] `SENTRY_DSN` → Para monitoreo de errores

#### Frontend - Web Client (Vercel)

- [ ] `NEXT_PUBLIC_API_URL` → URL del backend en producción
- [ ] `NEXT_PUBLIC_WEB_URL` → URL del web client
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` → Google OAuth de producción

#### Frontend - Admin Dashboard (Vercel)

- [ ] `NEXT_PUBLIC_API_URL` → URL del backend en producción
- [ ] `NEXT_PUBLIC_ADMIN_URL` → URL del admin dashboard
- [ ] `NEXT_PUBLIC_WS_URL` → URL del backend para WebSockets (mismo que API_URL sin /api/v1)
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` → Google OAuth de producción

---

### 5️⃣ Configuración de Mercado Pago en Producción ⚠️ IMPORTANTE

- [ ] Crear aplicación en Mercado Pago (modo producción)
- [ ] Obtener credenciales de producción:
  - [ ] `MERCADOPAGO_CLIENT_ID`
  - [ ] `MERCADOPAGO_CLIENT_SECRET`
  - [ ] `MERCADOPAGO_ACCESS_TOKEN`
- [ ] Configurar webhook URL en Mercado Pago:
  - [ ] URL: `https://tu-backend.railway.app/api/v1/webhooks/mercadopago`
  - [ ] Eventos: `payment`, `subscription`
- [ ] Configurar redirect URI:
  - [ ] `https://tu-backend.railway.app/api/v1/mercadopago/callback`
- [ ] Probar webhook con herramienta de Mercado Pago

---

### 6️⃣ Configuración de Google OAuth en Producción ⚠️ IMPORTANTE

- [ ] Ir a Google Cloud Console: https://console.cloud.google.com
- [ ] Crear proyecto o usar existente
- [ ] Habilitar Google+ API
- [ ] Crear credenciales OAuth 2.0:
  - [ ] Tipo: Web application
  - [ ] Authorized redirect URIs:
    - [ ] `https://tu-backend.railway.app/api/v1/auth/google/callback`
- [ ] Copiar `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`
- [ ] Configurar en variables de entorno del backend

---

### 7️⃣ WebSockets en Producción ⚠️ IMPORTANTE

- [ ] Verificar que el backend soporte WebSockets (Railway/Render lo soportan)
- [ ] Configurar `NEXT_PUBLIC_WS_URL` en Admin Dashboard:
  - [ ] Debe ser la URL del backend sin `/api/v1`
  - [ ] Ejemplo: `https://tu-backend.railway.app`
- [ ] Verificar que CORS permita conexiones WebSocket
- [ ] Probar conexión WebSocket desde el frontend

---

### 8️⃣ Verificaciones Finales ✅

#### Backend

- [ ] Probar endpoint de salud: `GET /api/v1/health` (si existe)
- [ ] Probar autenticación: `POST /api/v1/auth/login`
- [ ] Probar creación de turno: `POST /api/v1/appointments`
- [ ] Verificar logs en Railway/Render
- [ ] Verificar que no haya errores en consola

#### Frontend - Web Client

- [ ] Probar registro de usuario
- [ ] Probar login
- [ ] Probar reserva de turno
- [ ] Probar pago con Mercado Pago (modo producción)
- [ ] Verificar que las imágenes carguen correctamente
- [ ] Verificar que los enlaces funcionen

#### Frontend - Admin Dashboard

- [ ] Probar login de profesional
- [ ] Probar dashboard principal
- [ ] Probar calendario de turnos
- [ ] Probar creación de servicio
- [ ] Probar gestión de clientes
- [ ] Probar configuración de suscripción
- [ ] Verificar que WebSockets funcionen (notificaciones en tiempo real)

#### Integraciones

- [ ] Probar webhook de Mercado Pago (usar herramienta de prueba)
- [ ] Probar envío de emails (si está configurado)
- [ ] Probar OAuth con Google
- [ ] Verificar que los pagos se procesen correctamente

---

### 9️⃣ Monitoreo y Analytics (Opcional pero Recomendado)

#### Monitoreo de Errores

- [ ] Configurar Sentry:
  - [ ] Crear cuenta en Sentry
  - [ ] Crear proyecto para backend
  - [ ] Crear proyecto para frontend
  - [ ] Instalar SDK: `pnpm add @sentry/nextjs --filter admin-dashboard`
  - [ ] Configurar `SENTRY_DSN` en variables de entorno

#### Analytics

- [ ] Configurar Google Analytics 4:
  - [ ] Crear propiedad en GA4
  - [ ] Obtener Measurement ID
  - [ ] Agregar script en `_app.tsx` o `layout.tsx`
- [ ] O configurar Plausible Analytics (alternativa)

---

### 🔟 Optimizaciones Post-Deployment

- [ ] Verificar performance con Lighthouse:
  - [ ] Web Client: Score > 90
  - [ ] Admin Dashboard: Score > 90
- [ ] Verificar SEO:
  - [ ] Meta tags configurados
  - [ ] Open Graph tags
  - [ ] Sitemap.xml (si aplica)
- [ ] Configurar CDN para assets estáticos
- [ ] Configurar compresión gzip/brotli
- [ ] Optimizar imágenes (Next.js Image component)

---

## 🚨 Problemas Comunes y Soluciones

### Error: "Cannot connect to database"

- **Solución**: Verificar `DATABASE_URL` en variables de entorno
- **Solución**: Verificar que la base de datos esté accesible desde Railway/Render

### Error: "CORS policy blocked"

- **Solución**: Verificar `CORS_ORIGINS` en backend
- **Solución**: Incluir todas las URLs de Vercel

### Error: "WebSocket connection failed"

- **Solución**: Verificar `NEXT_PUBLIC_WS_URL` en frontend
- **Solución**: Verificar que el backend soporte WebSockets

### Error: "JWT secret is missing"

- **Solución**: Generar y configurar `JWT_SECRET` y `JWT_REFRESH_SECRET`

### Error: "Mercado Pago webhook failed"

- **Solución**: Verificar URL del webhook en Mercado Pago
- **Solución**: Verificar que el endpoint esté accesible públicamente

---

## 📝 Notas Importantes

1. **Nunca subir archivos `.env` a Git**: Las variables de entorno se configuran directamente en Vercel/Railway/Render
2. **Usar credenciales de producción**: No usar credenciales de desarrollo/test en producción
3. **Backups**: Configurar backups automáticos de la base de datos
4. **SSL/HTTPS**: Vercel y Railway/Render proporcionan SSL automáticamente
5. **Dominios personalizados**: Configurar después de verificar que todo funciona

---

## ✅ Próximos Pasos

1. **Completar deployment del backend** (Railway/Render) ⚠️ CRÍTICO
2. **Configurar base de datos de producción** ⚠️ CRÍTICO
3. **Configurar todas las variables de entorno** ⚠️ CRÍTICO
4. **Probar todas las funcionalidades** en producción
5. **Configurar monitoreo** (Sentry)
6. **Configurar analytics** (Google Analytics)

---

**Última actualización**: 14 de Noviembre, 2025
