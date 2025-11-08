# Script para iniciar todos los servicios del proyecto
# Uso: .\scripts\start-all.ps1

Write-Host "🚀 Iniciando todos los servicios..." -ForegroundColor Green

# 1. Detener todos los procesos de Node.js relacionados con el proyecto
Write-Host "`n📋 Deteniendo procesos de Node.js existentes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { 
    $_.Path -like "*nodejs*" 
} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 2. Limpiar archivos de lock
Write-Host "🧹 Limpiando archivos de lock..." -ForegroundColor Yellow
$lockFiles = @(
    "apps/web-client/.next/dev/lock",
    "apps/backend/.next/dev/lock"
)

foreach ($lockFile in $lockFiles) {
    if (Test-Path $lockFile) {
        Remove-Item $lockFile -Force -ErrorAction SilentlyContinue
        Write-Host "  ✓ Eliminado: $lockFile" -ForegroundColor Gray
    }
}

# 3. Verificar que Docker esté corriendo (para PostgreSQL y Redis)
Write-Host "`n🐳 Verificando Docker..." -ForegroundColor Yellow
$dockerRunning = docker ps 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ⚠ Docker no está corriendo. Iniciando servicios..." -ForegroundColor Yellow
    docker-compose up -d
    Start-Sleep -Seconds 5
} else {
    Write-Host "  ✓ Docker está corriendo" -ForegroundColor Green
}

# 4. Iniciar Backend (puerto 3000)
Write-Host "`n🔧 Iniciando Backend en puerto 3000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps/backend; Write-Host 'Backend iniciando en http://localhost:3000' -ForegroundColor Green; pnpm dev" -WindowStyle Normal

# Esperar un poco para que el backend inicie
Start-Sleep -Seconds 3

# 5. Iniciar Frontend Web Client (puerto 3001)
Write-Host "`n🎨 Iniciando Frontend Web Client en puerto 3001..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps/web-client; Write-Host 'Frontend iniciando en http://localhost:3001' -ForegroundColor Green; pnpm dev -- -p 3001" -WindowStyle Normal

Write-Host "`n✅ Todos los servicios están iniciando..." -ForegroundColor Green
Write-Host "`n📍 URLs:" -ForegroundColor Yellow
Write-Host "  - Backend API:     http://localhost:3000" -ForegroundColor White
Write-Host "  - Frontend Web:    http://localhost:3001" -ForegroundColor White
Write-Host "`n💡 Presiona Ctrl+C en cada ventana para detener los servicios" -ForegroundColor Gray

