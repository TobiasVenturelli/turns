# Script para instalar dependencias de testing (PowerShell)

Write-Host "📦 Instalando dependencias de testing..." -ForegroundColor Cyan

pnpm add -D `
  vitest@^2.1.8 `
  @vitest/ui@^2.1.8 `
  @vitest/coverage-v8@^2.1.8 `
  @vitejs/plugin-react@^4.3.4 `
  @testing-library/react@^16.1.0 `
  @testing-library/jest-dom@^6.6.3 `
  @testing-library/user-event@^14.5.2 `
  @playwright/test@^1.48.0 `
  jsdom@^25.0.1 `
  msw@^2.6.4

Write-Host "✅ Dependencias instaladas!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Para ejecutar tests:" -ForegroundColor Yellow
Write-Host "  - Unitarios: pnpm test"
Write-Host "  - E2E: pnpm test:e2e"
Write-Host "  - Con UI: pnpm test:ui"

