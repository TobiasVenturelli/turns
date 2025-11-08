# Script de validación del Admin Dashboard
# Ejecuta tests para verificar que todo funciona correctamente

Write-Host "🔍 Iniciando validación del Admin Dashboard..." -ForegroundColor Cyan
Write-Host ""

# Verificar que Node.js esté instalado
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ ERROR: Node.js no está instalado" -ForegroundColor Red
    exit 1
}

# Verificar que el backend esté corriendo
Write-Host "1️⃣ Verificando que el backend esté corriendo..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/v1" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   ✅ Backend respondiendo" -ForegroundColor Green
} catch {
    Write-Host "   ❌ ERROR: Backend no está corriendo en http://localhost:3000" -ForegroundColor Red
    Write-Host "   💡 Ejecuta: cd apps/backend && pnpm dev" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Ejecutar script de validación
Write-Host "2️⃣ Ejecutando tests de validación..." -ForegroundColor Yellow
Write-Host ""

$scriptPath = Join-Path $PSScriptRoot "validate-setup.js"

if (Test-Path $scriptPath) {
    node $scriptPath
    $exitCode = $LASTEXITCODE
    if ($exitCode -eq 0) {
        Write-Host ""
        Write-Host "✅ Todos los tests pasaron correctamente!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Algunos tests fallaron" -ForegroundColor Red
        exit $exitCode
    }
} else {
    Write-Host "❌ ERROR: No se encontró el script de validación" -ForegroundColor Red
    exit 1
}

