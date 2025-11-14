# Script para ejecutar Prisma Studio con la base de datos de producción
# Uso: .\scripts\prisma-studio-prod.ps1 [DATABASE_URL]
# Ejemplo: .\scripts\prisma-studio-prod.ps1 "postgresql://user:pass@host:5432/db"

param(
    [Parameter(Mandatory=$false)]
    [string]$DatabaseUrl = ""
)

Write-Host "🔍 Prisma Studio - Base de Datos de Producción" -ForegroundColor Cyan
Write-Host ""

# Si no se proporcionó como parámetro, solicitarla
if ([string]::IsNullOrWhiteSpace($DatabaseUrl)) {
    Write-Host "📋 Pasos:" -ForegroundColor Yellow
    Write-Host "1. Ve a Render Dashboard → tu base de datos 'turns-db'" -ForegroundColor White
    Write-Host "2. Copia la 'External Database URL'" -ForegroundColor White
    Write-Host "3. Pégala aquí (o ejecuta el script con la URL como parámetro)" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Tip: Puedes ejecutar: .\scripts\prisma-studio-prod.ps1 'tu-url-aqui'" -ForegroundColor Cyan
    Write-Host ""
    
    $DatabaseUrl = Read-Host "Pega la External Database URL de Render"
}

if ([string]::IsNullOrWhiteSpace($DatabaseUrl)) {
    Write-Host ""
    Write-Host "❌ Error: No se proporcionó la URL de la base de datos" -ForegroundColor Red
    Write-Host ""
    Write-Host "📝 Uso correcto:" -ForegroundColor Yellow
    Write-Host "   .\scripts\prisma-studio-prod.ps1 'postgresql://user:pass@host:5432/db'" -ForegroundColor White
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

# Establecer la variable de entorno ANTES de cambiar de directorio
$env:DATABASE_URL = $DatabaseUrl

# Verificar que se estableció correctamente
if ([string]::IsNullOrWhiteSpace($env:DATABASE_URL)) {
    Write-Host ""
    Write-Host "❌ Error: No se pudo establecer la variable DATABASE_URL" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Variable DATABASE_URL establecida" -ForegroundColor Green
Write-Host "📊 Iniciando Prisma Studio..." -ForegroundColor Cyan
Write-Host "🔗 Se abrirá en: http://localhost:5555" -ForegroundColor Green
Write-Host ""

# Cambiar al directorio del backend
$backendDir = Join-Path $PSScriptRoot ".."
Set-Location $backendDir

# Crear archivos .env en múltiples ubicaciones para asegurar que Prisma Studio lo encuentre
$envFileBackend = Join-Path $backendDir ".env"
$envFilePrisma = Join-Path $backendDir "prisma" ".env"
$envContent = "DATABASE_URL=$DatabaseUrl"

# Crear .env en el directorio del backend
Set-Content -Path $envFileBackend -Value $envContent -Force -Encoding UTF8

# Crear .env también en el directorio prisma (por si acaso)
$prismaDir = Join-Path $backendDir "prisma"
if (-not (Test-Path $prismaDir)) {
    New-Item -ItemType Directory -Path $prismaDir -Force | Out-Null
}
Set-Content -Path $envFilePrisma -Value $envContent -Force -Encoding UTF8

# Verificar que los archivos se crearon correctamente
if (Test-Path $envFileBackend) {
    Write-Host "✅ Archivo .env creado en: $envFileBackend" -ForegroundColor Green
    Write-Host "✅ Archivo .env creado en: $envFilePrisma" -ForegroundColor Green
    
    # Leer y mostrar el contenido (sin contraseña) para verificación
    $envContentRead = Get-Content $envFileBackend -Raw
    $envContentDisplay = $envContentRead -replace '://([^:]+):([^@]+)@', '://$1:***@'
    Write-Host "📋 Contenido del .env: $envContentDisplay" -ForegroundColor Gray
} else {
    Write-Host "❌ Error: No se pudo crear el archivo .env" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📊 Iniciando Prisma Studio..." -ForegroundColor Cyan
Write-Host "🔗 Se abrirá en: http://localhost:5555" -ForegroundColor Green
Write-Host ""

# Ejecutar Prisma Studio con la variable de entorno establecida
# Usar Start-Process para asegurar que la variable se herede correctamente
$env:DATABASE_URL = $DatabaseUrl

# Ruta al schema de Prisma
$schemaPath = Join-Path $backendDir "prisma" "schema.prisma"

# Ejecutar Prisma Studio
try {
    # Usar pnpm directamente con la variable de entorno establecida y especificar el schema
    & pnpm prisma studio --schema $schemaPath
} catch {
    Write-Host ""
    Write-Host "❌ Error al ejecutar Prisma Studio: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Intenta ejecutar manualmente:" -ForegroundColor Yellow
    Write-Host "   cd apps/backend" -ForegroundColor White
    Write-Host "   `$env:DATABASE_URL='$urlForDisplay'" -ForegroundColor White
    Write-Host "   pnpm prisma studio" -ForegroundColor White
    exit 1
} finally {
    Write-Host ""
    Write-Host "💡 El archivo .env temporal se mantendrá en: $envFile" -ForegroundColor Yellow
    Write-Host "   Puedes eliminarlo manualmente si lo deseas." -ForegroundColor Yellow
}

