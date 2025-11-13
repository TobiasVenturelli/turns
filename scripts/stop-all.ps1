# Script para detener todos los servicios del proyecto
# Uso: .\scripts\stop-all.ps1

Write-Host "🛑 Deteniendo todos los servicios del proyecto Turns..." -ForegroundColor Red

# Función para matar procesos en un puerto específico
function Kill-ProcessOnPort {
    param (
        [int]$Port,
        [string]$ServiceName
    )
    
    Write-Host "  🔍 Deteniendo $ServiceName (puerto $Port)..." -ForegroundColor Gray
    
    $connections = netstat -ano | findstr ":$Port"
    
    if ($connections) {
        $connections -split "`n" | ForEach-Object {
            if ($_ -match '\s+(\d+)\s*$') {
                $processId = $matches[1]
                try {
                    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
                    if ($process) {
                        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                        Write-Host "    ✓ $ServiceName detenido (PID: $processId)" -ForegroundColor Green
                    }
                } catch {
                    # Ignorar errores si el proceso ya no existe
                }
            }
        }
    } else {
        Write-Host "    ℹ $ServiceName no está corriendo" -ForegroundColor Gray
    }
}

# Detener todos los servicios por puerto
Write-Host "`n📋 Deteniendo servicios..." -ForegroundColor Yellow
Kill-ProcessOnPort -Port 3000 -ServiceName "Backend API"
Kill-ProcessOnPort -Port 3001 -ServiceName "Web Client"
Kill-ProcessOnPort -Port 3002 -ServiceName "Admin Dashboard"
Kill-ProcessOnPort -Port 3003 -ServiceName "Landing Page"

# Detener cualquier otro proceso de Node.js relacionado
Write-Host "`n🧹 Limpiando procesos de Node.js restantes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Procesos de Node.js limpiados" -ForegroundColor Green
} else {
    Write-Host "  ℹ No hay procesos de Node.js adicionales" -ForegroundColor Gray
}

# Detener servicios de Docker (opcional, comentado por defecto)
# Write-Host "`n🐳 Deteniendo servicios de Docker..." -ForegroundColor Yellow
# docker-compose down

Write-Host "`n✅ Todos los servicios han sido detenidos correctamente" -ForegroundColor Green

