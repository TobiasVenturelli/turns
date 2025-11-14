# Script para ejecutar el seed con la base de datos de producción
# Uso: .\scripts\seed-prod.ps1 [DATABASE_URL]
# Ejemplo: .\scripts\seed-prod.ps1 "postgresql://user:pass@host:5432/db"

param(
    [Parameter(Mandatory=$false)]
    [string]$DatabaseUrl = ""
)

Write-Host "🌱 Seed de Base de Datos - Producción" -ForegroundColor Cyan
Write-Host ""

# Si no se proporcionó como parámetro, solicitarla
if ([string]::IsNullOrWhiteSpace($DatabaseUrl)) {
    Write-Host "📋 Pasos:" -ForegroundColor Yellow
    Write-Host "1. Ve a Render Dashboard → tu base de datos 'turns-db'" -ForegroundColor White
    Write-Host "2. Copia la 'External Database URL'" -ForegroundColor White
    Write-Host "3. Pégala aquí (o ejecuta el script con la URL como parámetro)" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  ADVERTENCIA: Este script LIMPIARÁ toda la base de datos y creará datos iniciales" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Tip: Puedes ejecutar: .\scripts\seed-prod.ps1 'tu-url-aqui'" -ForegroundColor Cyan
    Write-Host ""
    
    $DatabaseUrl = Read-Host "Pega la External Database URL de Render"
}

if ([string]::IsNullOrWhiteSpace($DatabaseUrl)) {
    Write-Host ""
    Write-Host "❌ Error: No se proporcionó la URL de la base de datos" -ForegroundColor Red
    Write-Host ""
    Write-Host "📝 Uso correcto:" -ForegroundColor Yellow
    Write-Host "   .\scripts\seed-prod.ps1 'postgresql://user:pass@host:5432/db'" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Limpiar la URL (eliminar espacios y saltos de línea)
$DatabaseUrl = $DatabaseUrl.Trim()

# Validar que la URL tenga el formato correcto
if ($DatabaseUrl -notmatch "^postgresql://" -and $DatabaseUrl -notmatch "^postgres://") {
    Write-Host ""
    Write-Host "❌ Error: La URL debe comenzar con 'postgresql://' o 'postgres://'" -ForegroundColor Red
    Write-Host ""
    Write-Host "📝 Formato esperado:" -ForegroundColor Yellow
    Write-Host "   postgresql://usuario:password@host:5432/database" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Asegúrate de copiar la 'External Database URL' completa de Render" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

# Agregar sslmode=require si no está presente
if ($DatabaseUrl -notmatch "sslmode=") {
    if ($DatabaseUrl -match "\?") {
        $DatabaseUrl = "$DatabaseUrl&sslmode=require"
    } else {
        $DatabaseUrl = "$DatabaseUrl?sslmode=require"
    }
}

Write-Host ""
Write-Host "🌐 Configurando conexión..." -ForegroundColor Cyan

# Mostrar URL sin contraseña para verificación
$urlForDisplay = $DatabaseUrl -replace '://([^:]+):([^@]+)@', '://$1:***@'
Write-Host "📋 URL: $urlForDisplay" -ForegroundColor Gray

# Establecer la variable de entorno
$env:DATABASE_URL = $DatabaseUrl

# Verificar que se estableció correctamente
if ([string]::IsNullOrWhiteSpace($env:DATABASE_URL)) {
    Write-Host ""
    Write-Host "❌ Error: No se pudo establecer la variable DATABASE_URL" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Variable DATABASE_URL establecida" -ForegroundColor Green
Write-Host ""

# Cambiar al directorio del backend
$backendDir = Join-Path $PSScriptRoot ".."
Set-Location $backendDir

# Crear archivo .env temporal
$envFile = Join-Path $backendDir ".env"
$envContent = "DATABASE_URL=$DatabaseUrl"
Set-Content -Path $envFile -Value $envContent -Force -Encoding UTF8

Write-Host "📝 Archivo .env temporal creado" -ForegroundColor Gray
Write-Host ""
Write-Host "🌱 Ejecutando seed..." -ForegroundColor Cyan
Write-Host "⚠️  Esto limpiará la base de datos y creará datos iniciales" -ForegroundColor Yellow
Write-Host ""

# Ejecutar el seed
try {
    & pnpm prisma db seed
    Write-Host ""
    Write-Host "✅ Seed ejecutado correctamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Datos creados:" -ForegroundColor Cyan
    Write-Host "   - Planes de suscripción (Free, Basic, Pro)" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "❌ Error al ejecutar el seed: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Verifica:" -ForegroundColor Yellow
    Write-Host "   1. Que la URL de la base de datos sea correcta" -ForegroundColor White
    Write-Host "   2. Que la base de datos permita conexiones externas" -ForegroundColor White
    Write-Host "   3. Que las migraciones se hayan ejecutado correctamente" -ForegroundColor White
    exit 1
} finally {
    Write-Host ""
    Write-Host "💡 El archivo .env temporal se mantendrá en: $envFile" -ForegroundColor Yellow
    Write-Host "   Puedes eliminarlo manualmente si lo deseas." -ForegroundColor Yellow
}

