# Script para iniciar todos los servicios del proyecto
# Uso: .\scripts\start-all.ps1

Write-Host "🚀 Iniciando todos los servicios del proyecto Turns..." -ForegroundColor Green

# 1. Función para matar procesos en un puerto específico
function Kill-ProcessOnPort {
    param (
        [int]$Port
    )
    
    Write-Host "  🔍 Buscando procesos en puerto $Port..." -ForegroundColor Gray
    
    $connections = netstat -ano | findstr ":$Port"
    
    if ($connections) {
        $connections -split "`n" | ForEach-Object {
            if ($_ -match '\s+(\d+)\s*$') {
                $processId = $matches[1]
                try {
                    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
                    if ($process) {
                        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                        Write-Host "    ✓ Proceso $processId eliminado del puerto $Port" -ForegroundColor Green
                    }
                } catch {
                    # Ignorar errores si el proceso ya no existe
                }
            }
        }
    } else {
        Write-Host "    ℹ Puerto $Port libre" -ForegroundColor Gray
    }
}

# 2. Detener todos los procesos en los puertos del proyecto
Write-Host "`n📋 Liberando puertos..." -ForegroundColor Yellow
Kill-ProcessOnPort -Port 3000  # Backend
Kill-ProcessOnPort -Port 3001  # Web Client
Kill-ProcessOnPort -Port 3002  # Admin Dashboard
Kill-ProcessOnPort -Port 3003  # Landing Page

Start-Sleep -Seconds 2

# 3. Limpiar archivos de lock de Next.js
Write-Host "`n🧹 Limpiando archivos de lock..." -ForegroundColor Yellow
$lockFiles = @(
    "apps/web-client/.next",
    "apps/admin-dashboard/.next",
    "apps/landing/.next"
)

foreach ($lockFile in $lockFiles) {
    if (Test-Path $lockFile) {
        Remove-Item "$lockFile/cache/fetch-cache" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  ✓ Cache limpiado: $lockFile" -ForegroundColor Gray
    }
}

# 4. Verificar que Docker esté corriendo (para PostgreSQL)
Write-Host "`n🐳 Verificando Docker..." -ForegroundColor Yellow
$dockerRunning = docker ps 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ⚠ Docker no está corriendo. Iniciando servicios..." -ForegroundColor Yellow
    docker-compose up -d
    Start-Sleep -Seconds 5
} else {
    Write-Host "  ✓ Docker está corriendo" -ForegroundColor Green
}

# 5. Iniciar Backend (puerto 3000)
Write-Host "`n🔧 Iniciando Backend en puerto 3000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD/apps/backend'; Write-Host '🔧 Backend API - http://localhost:3000' -ForegroundColor Green; pnpm dev" -WindowStyle Normal

Start-Sleep -Seconds 3

# 6. Iniciar Web Client (puerto 3001)
Write-Host "`n🌐 Iniciando Web Client en puerto 3001..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD/apps/web-client'; Write-Host '🌐 Web Client - http://localhost:3001' -ForegroundColor Green; pnpm dev -p 3001" -WindowStyle Normal

Start-Sleep -Seconds 2

# 7. Iniciar Admin Dashboard (puerto 3002)
Write-Host "`n🎨 Iniciando Admin Dashboard en puerto 3002..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD/apps/admin-dashboard'; Write-Host '🎨 Admin Dashboard - http://localhost:3002' -ForegroundColor Green; pnpm dev" -WindowStyle Normal

Start-Sleep -Seconds 2

# 8. Iniciar Landing Page (puerto 3003)
Write-Host "`n🚀 Iniciando Landing Page en puerto 3003..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD/apps/landing'; Write-Host '🚀 Landing Page - http://localhost:3003' -ForegroundColor Green; pnpm dev" -WindowStyle Normal

Write-Host "`n✅ Todos los servicios están iniciando..." -ForegroundColor Green
Write-Host "`n📍 URLs disponibles:" -ForegroundColor Yellow
Write-Host "  🔧 Backend API:        http://localhost:3000/api/v1" -ForegroundColor White
Write-Host "  🌐 Web Client:         http://localhost:3001" -ForegroundColor White
Write-Host "  🎨 Admin Dashboard:    http://localhost:3002" -ForegroundColor White
Write-Host "  🚀 Landing Page:       http://localhost:3003" -ForegroundColor White
Write-Host "`n💡 Presiona Ctrl+C en cada ventana para detener los servicios" -ForegroundColor Gray
Write-Host "💡 O ejecuta .\scripts\stop-all.ps1 para detener todos los servicios" -ForegroundColor Gray

