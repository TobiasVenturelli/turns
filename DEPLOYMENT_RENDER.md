# 🚀 Guía de Deployment en Render

## ✅ Configuración Lista para Producción

El proyecto ha sido preparado para producción con los siguientes cambios:

### Cambios Realizados:

1. ✅ **Prisma movido a dependencies**: `prisma` ahora está en `dependencies` para que esté disponible en producción
2. ✅ **Script postinstall agregado**: Genera Prisma Client automáticamente después de `pnpm install`
3. ✅ **Scripts de build optimizados**: Preparados para producción
4. ✅ **Logging mejorado**: Mejor información en los logs de producción

---

## 📋 Configuración en Render

### 1. Root Directory

```
apps/backend
```

### 2. Build Command

```
pnpm install --no-frozen-lockfile && pnpm build
```

**Nota**: El `postinstall` script generará Prisma Client automáticamente.

### 3. Start Command

```
pnpm start:prod
```

---

## 🔧 Variables de Entorno Requeridas

### Obligatorias:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=<Internal Database URL de PostgreSQL>
JWT_SECRET=<genera uno seguro>
JWT_REFRESH_SECRET=<genera otro seguro>
```

### Mercado Pago (Producción):

```
MERCADOPAGO_CLIENT_ID=<tu-client-id-produccion>
MERCADOPAGO_CLIENT_SECRET=<tu-secret-produccion>
MERCADOPAGO_ACCESS_TOKEN=<tu-access-token-produccion>
```

### Google OAuth:

```
GOOGLE_CLIENT_ID=<tu-google-client-id>
GOOGLE_CLIENT_SECRET=<tu-google-client-secret>
GOOGLE_CALLBACK_URL=https://tu-backend.onrender.com/api/v1/auth/google/callback
```

### URLs:

```
WEB_URL=https://tu-web-client.vercel.app
ADMIN_URL=https://tu-admin-dashboard.vercel.app
CORS_ORIGINS=https://tu-web-client.vercel.app,https://tu-admin-dashboard.vercel.app
API_URL=https://tu-backend.onrender.com
```

---

## 🗄️ Base de Datos

### Después del primer deploy:

1. **Ejecutar migraciones** (desde tu máquina local):

```bash
cd apps/backend
DATABASE_URL=<External Database URL> pnpm prisma migrate deploy
```

2. **Ejecutar seeds** (planes de suscripción):

```bash
cd apps/backend
DATABASE_URL=<External Database URL> pnpm prisma db seed
```

---

## ✅ Verificación

Después del deploy, verifica:

1. ✅ El servidor inicia sin errores
2. ✅ Los logs muestran: `🚀 Servidor corriendo en: ...`
3. ✅ Puedes acceder a: `https://tu-backend.onrender.com/api/v1`
4. ✅ La base de datos está conectada
5. ✅ WebSockets funcionan correctamente

---

## 🔄 Actualizar Frontend en Vercel

Después de obtener la URL del backend en Render, actualiza en Vercel:

### Web Client:

```
NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com/api/v1
NEXT_PUBLIC_WS_URL=https://tu-backend.onrender.com
```

### Admin Dashboard:

```
NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com/api/v1
NEXT_PUBLIC_WS_URL=https://tu-backend.onrender.com
```

---

## 🐛 Troubleshooting

### Error: "prisma: not found"

- ✅ **Solucionado**: Prisma ahora está en `dependencies` y se genera automáticamente con `postinstall`

### Error: "turbo: not found"

- ✅ **Solucionado**: No usamos turbo en producción, los comandos van directo al backend

### Error: "Cannot connect to database"

- Verifica que `DATABASE_URL` esté configurada correctamente
- Usa la "Internal Database URL" para el backend en Render

### Error: "CORS policy blocked"

- Verifica que `CORS_ORIGINS` incluya todas las URLs de Vercel

---

## 📝 Notas Importantes

1. **Lockfile**: Usamos `--no-frozen-lockfile` temporalmente hasta que el lockfile esté completamente sincronizado
2. **Prisma**: Se genera automáticamente con `postinstall`, no necesitas ejecutarlo manualmente
3. **Puerto**: Render asigna el puerto automáticamente, pero puedes configurarlo con `PORT=10000`
4. **Sleep Mode**: Render Free se duerme después de 15 min de inactividad. Usa UptimeRobot para mantenerlo despierto.

---

**Última actualización**: 14 de Noviembre, 2025
