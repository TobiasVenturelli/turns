# 🧪 Guía de Testing del Admin Dashboard

## 📋 Tests Disponibles

### 1. Validación Completa del Setup

Ejecuta todos los tests para verificar que el Admin Dashboard funciona correctamente.

#### Opción A: Con PowerShell (Windows)

```powershell
cd apps/admin-dashboard
.\scripts\validate.ps1
```

#### Opción B: Con Node.js directamente

```bash
cd apps/admin-dashboard
node scripts/validate-setup.js
```

#### Opción C: Con pnpm (requiere tsx)

```bash
cd apps/admin-dashboard
pnpm install  # Instalar tsx si no está instalado
pnpm validate
```

---

## ✅ Qué Verifican los Tests

Los tests verifican:

1. **✅ API Backend disponible**
   - Verifica que el backend esté corriendo en `http://localhost:3000`
   - Prueba conectividad básica

2. **✅ Registro de usuario PROFESSIONAL**
   - Crea un usuario de prueba con rol PROFESSIONAL
   - Verifica que el registro funcione correctamente
   - Si el usuario ya existe, prueba login

3. **✅ Autenticación JWT**
   - Verifica que el endpoint `/auth/me` funcione
   - Confirma que el token JWT sea válido
   - Verifica que el rol sea PROFESSIONAL

4. **✅ Endpoints protegidos**
   - Prueba `/appointments/professional/appointments`
   - Prueba `/businesses/my-business`
   - Verifica que requieran autenticación

5. **✅ Refresh Token**
   - Prueba el refresh de tokens
   - Verifica que se pueda obtener un nuevo access token

---

## 🚀 Ejecutar Tests Manualmente

### Test 1: Verificar Backend

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/v1" -Method GET
```

### Test 2: Registrar Usuario PROFESSIONAL

```powershell
$body = @{
    email = "test@test.com"
    password = "123456"
    firstName = "Test"
    lastName = "Professional"
    role = "PROFESSIONAL"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/register" -Method POST -ContentType "application/json" -Body $body
```

### Test 3: Login

```powershell
$body = @{
    email = "test@test.com"
    password = "123456"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" -Method POST -ContentType "application/json" -Body $body
$token = $response.accessToken
```

### Test 4: Verificar Usuario Autenticado

```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/me" -Method GET -Headers $headers
```

---

## 🐛 Solución de Problemas

### Error: "No se puede conectar a la API"

**Solución**: Asegúrate de que el backend esté corriendo:

```bash
cd apps/backend
pnpm dev
```

### Error: "Usuario ya existe"

**Solución**: El test intentará hacer login automáticamente. Si falla, elimina el usuario de la base de datos o usa otro email.

### Error: "Token inválido"

**Solución**: Verifica que las variables de entorno estén configuradas correctamente en `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### Error: "No se puede ejecutar el script"

**Solución**: En PowerShell, ejecuta:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 📊 Resultados Esperados

Si todos los tests pasan, deberías ver:

```
✅ Validación completada exitosamente!

📊 Resumen:
   - API Backend: ✅ Funcionando
   - Registro de PROFESSIONAL: ✅ Funcionando
   - Autenticación JWT: ✅ Funcionando
   - Endpoints protegidos: ✅ Funcionando
   - Refresh token: ✅ Funcionando

🎉 El Admin Dashboard está listo para usar!
```

---

## 🔄 Ejecutar Tests en CI/CD

Para ejecutar en pipelines de CI/CD:

```bash
# Instalar dependencias
pnpm install

# Ejecutar tests
cd apps/admin-dashboard
node scripts/validate-setup.js
```

---

## 📝 Notas

- Los tests crean un usuario de prueba con email único basado en timestamp
- Los tokens se generan automáticamente durante los tests
- Los tests no modifican datos existentes (solo crean usuarios de prueba)
- Si un test falla, el script se detiene y muestra el error
