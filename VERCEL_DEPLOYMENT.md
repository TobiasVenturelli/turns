# 🚀 Guía de Despliegue en Vercel

## ✅ Cambios Realizados

1. **Script postinstall condicional**: El backend ahora solo ejecuta `prisma generate` si `DATABASE_URL` está disponible
2. **Archivos vercel.json**: Configuración básica para cada frontend

## 📋 Pasos para Desplegar en Vercel

### Opción 1: Desde el Dashboard de Vercel (Recomendado)

Para cada proyecto frontend (admin-dashboard, web-client, landing):

1. **Conectar repositorio**:
   - Ve a [Vercel Dashboard](https://vercel.com/dashboard)
   - Click en "Add New Project"
   - Conecta tu repositorio de GitHub: `TobiasVenturelli/turns`

2. **Configurar proyecto**:
   - **Framework Preset**: Next.js (auto-detectado)
   - **Root Directory**:
     - Para Admin Dashboard: `apps/admin-dashboard`
     - Para Web Client: `apps/web-client`
     - Para Landing: `apps/landing`
   - **Build Command**: `pnpm build` (o dejar vacío, Vercel lo detecta)
   - **Install Command**: `cd ../.. && pnpm install` (o dejar vacío)
   - **Output Directory**: `.next` (auto-detectado)

3. **Variables de Entorno**:
   - Para **Admin Dashboard** y **Web Client**, agrega:
     ```
     NEXT_PUBLIC_API_URL=https://turns-backend.onrender.com/api/v1
     ```
   - Para **Landing**: No necesita variables de entorno

4. **Deploy**: Click en "Deploy"

### Opción 2: Desde CLI de Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Para cada proyecto, desde la raíz del monorepo:
cd apps/admin-dashboard
vercel --prod

cd ../web-client
vercel --prod

cd ../landing
vercel --prod
```

## 🔧 Solución al Error de Prisma

El error que tenías era:

```
Failed to load config file... Missing required environment variable: DATABASE_URL
```

**Solución aplicada**:

- El `postinstall` del backend ahora es condicional
- Solo ejecuta `prisma generate` si `DATABASE_URL` está disponible
- Si no está disponible (como en builds de frontend), simplemente lo omite

## 📝 Notas Importantes

1. **No despliegues el backend en Vercel**: El backend ya está en Render y funciona bien ahí
2. **Root Directory es crítico**: Asegúrate de configurar el Root Directory correcto para cada proyecto
3. **Variables de entorno**: Solo los frontends necesitan `NEXT_PUBLIC_API_URL`
4. **Monorepo**: Vercel detecta automáticamente que es un monorepo con pnpm

## ✅ Verificación Post-Deploy

Después de desplegar, verifica:

1. **Admin Dashboard**: `https://tu-proyecto-admin.vercel.app`
   - Debe cargar la página de login
   - Debe poder hacer login con `profesional@test.com` / `Password123!`

2. **Web Client**: `https://tu-proyecto-web.vercel.app`
   - Debe cargar la página principal
   - Debe poder acceder a `/[businessSlug]` (ej: `/peluqueria-maria`)

3. **Landing**: `https://tu-proyecto-landing.vercel.app`
   - Debe cargar la landing page

## 🐛 Troubleshooting

### Error: "Cannot find module"

- Verifica que el Root Directory esté configurado correctamente
- Asegúrate de que `pnpm install` se ejecute desde la raíz del monorepo

### Error: "Build failed"

- Revisa los logs de build en Vercel
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que no haya errores de TypeScript

### Error: "API URL not found"

- Verifica que la variable `NEXT_PUBLIC_API_URL` esté configurada
- Asegúrate de que el backend esté funcionando en Render

---

_Última actualización: 18 de Noviembre, 2025_
