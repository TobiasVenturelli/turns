#!/bin/bash
# Script para instalar dependencias de testing

echo "📦 Instalando dependencias de testing..."

pnpm add -D \
  vitest@^2.1.8 \
  @vitest/ui@^2.1.8 \
  @vitest/coverage-v8@^2.1.8 \
  @vitejs/plugin-react@^4.3.4 \
  @testing-library/react@^16.1.0 \
  @testing-library/jest-dom@^6.6.3 \
  @testing-library/user-event@^14.5.2 \
  @playwright/test@^1.48.0 \
  jsdom@^25.0.1 \
  msw@^2.6.4

echo "✅ Dependencias instaladas!"
echo ""
echo "🚀 Para ejecutar tests:"
echo "  - Unitarios: pnpm test"
echo "  - E2E: pnpm test:e2e"
echo "  - Con UI: pnpm test:ui"

