# Script para detener todos los servicios del proyecto
# Uso: .\scripts\stop-all.ps1

Write-Host "🛑 Deteniendo todos los servicios..." -ForegroundColor Red

# Detener todos los procesos de Node.js
Write-Host "`n📋 Deteniendo procesos de Node.js..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "  ✓ Procesos de Node.js detenidos" -ForegroundColor Green
} else {
    Write-Host "  ℹ No hay procesos de Node.js corriendo" -ForegroundColor Gray
}

# Detener servicios de Docker (opcional, comentado por defecto)
# Write-Host "`n🐳 Deteniendo servicios de Docker..." -ForegroundColor Yellow
# docker-compose down

Write-Host "`n✅ Todos los servicios han sido detenidos" -ForegroundColor Green

