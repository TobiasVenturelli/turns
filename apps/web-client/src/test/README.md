# 🧪 Testing - Web Client

Este directorio contiene todos los archivos relacionados con testing del frontend.

## 📁 Estructura

```
src/test/
├── setup.ts              # Configuración global de tests
├── utils.tsx             # Utilidades para testing (render personalizado)
├── mockData.ts           # Datos mock para tests
├── e2e/                  # Tests E2E con Playwright
│   └── reserva-flow.spec.ts
└── README.md             # Este archivo
```

## 🚀 Comandos Disponibles

### Tests Unitarios (Vitest)

```bash
# Ejecutar todos los tests
pnpm test

# Modo watch (re-ejecuta al cambiar archivos)
pnpm test:watch

# Interfaz visual de Vitest
pnpm test:ui

# Con cobertura de código
pnpm test:coverage
```

### Tests E2E (Playwright)

```bash
# Ejecutar tests E2E
pnpm test:e2e

# Interfaz visual de Playwright
pnpm test:e2e:ui

# Ejecutar en un navegador específico
pnpm test:e2e --project=chromium
```

## 📝 Escribir Tests

### Test de Componente

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('debe renderizar correctamente', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Test de Servicio

```tsx
import { describe, it, expect, vi } from 'vitest';
import { myService } from '../my.service';
import apiClient from '@/config/api';

vi.mock('@/config/api');

describe('myService', () => {
  it('debe hacer una llamada correcta', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: {} });
    await myService.getData();
    expect(apiClient.get).toHaveBeenCalledWith('/endpoint');
  });
});
```

## 🎯 Cobertura Objetivo

- **Mínimo**: 70% de cobertura
- **Objetivo**: 80%+ de cobertura
- **Crítico**: 90%+ para servicios y lógica de negocio

## 📚 Recursos

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Docs](https://playwright.dev/)
