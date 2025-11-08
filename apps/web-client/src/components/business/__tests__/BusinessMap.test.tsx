/**
 * @file BusinessMap.test.tsx
 * @description Tests para el componente BusinessMap
 * @author Turns Team
 * @created 2025-11-08
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { BusinessMap } from '../BusinessMap';

describe('BusinessMap', () => {
  it('debe mostrar mapa cuando hay coordenadas', () => {
    render(
      <BusinessMap
        latitude={-34.6037}
        longitude={-58.3816}
        address="Av. Corrientes 1234"
        city="Buenos Aires"
      />,
    );

    const iframe = screen.getByTitle('Ubicación del negocio');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src');
  });

  it('debe mostrar mapa cuando hay dirección sin coordenadas', () => {
    render(
      <BusinessMap
        address="Av. Corrientes 1234"
        city="Buenos Aires"
        state="CABA"
      />,
    );

    const iframe = screen.getByTitle('Ubicación del negocio');
    expect(iframe).toBeInTheDocument();
  });

  it('debe mostrar mensaje cuando no hay información de ubicación', () => {
    render(<BusinessMap />);

    expect(
      screen.getByText(/Ubicación no disponible/i),
    ).toBeInTheDocument();
  });
});

