# Script para reiniciar todos los servicios
# Uso: .\scripts\restart-all.ps1

# Obtener la ruta del script actual
if ($PSScriptRoot) {
    $ScriptPath = $PSScriptRoot
} else {
    $ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
    if (-not $ScriptPath) {
        $ScriptPath = Join-Path (Get-Location) "scripts"
    }
}

Write-Host "🔄 Reiniciando todos los servicios..." -ForegroundColor Cyan

# Ejecutar stop-all primero
$stopScript = Join-Path $ScriptPath "stop-all.ps1"
if (Test-Path $stopScript) {
    & $stopScript
} else {
    Write-Host "❌ No se encontró el script stop-all.ps1 en $ScriptPath" -ForegroundColor Red
    exit 1
}

# Esperar un momento
Start-Sleep -Seconds 2

# Ejecutar start-all
$startScript = Join-Path $ScriptPath "start-all.ps1"
if (Test-Path $startScript) {
    & $startScript
} else {
    Write-Host "❌ No se encontró el script start-all.ps1 en $ScriptPath" -ForegroundColor Red
    exit 1
}

