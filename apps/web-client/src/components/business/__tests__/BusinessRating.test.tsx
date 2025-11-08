/**
 * @file BusinessRating.test.tsx
 * @description Tests para el componente BusinessRating
 * @author Turns Team
 * @created 2025-11-08
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { BusinessRating } from '../BusinessRating';

describe('BusinessRating', () => {
  it('debe mostrar el rating correctamente', () => {
    render(<BusinessRating rating={4.5} reviewCount={24} />);

    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(24 reseñas)')).toBeInTheDocument();
  });

  it('debe mostrar 5 estrellas llenas para rating 5', () => {
    const { container } = render(<BusinessRating rating={5} reviewCount={10} />);

    // Buscar SVGs con la clase fill-yellow-400
    const filledStars = container.querySelectorAll('.fill-yellow-400');
    expect(filledStars.length).toBeGreaterThanOrEqual(5);
  });

  it('debe mostrar mensaje cuando no hay reseñas', () => {
    render(<BusinessRating rating={0} reviewCount={0} />);

    expect(
      screen.getByText(/Aún no hay reseñas/i),
    ).toBeInTheDocument();
  });

  it('debe mostrar singular "reseña" cuando hay 1 reseña', () => {
    render(<BusinessRating rating={5} reviewCount={1} />);

    expect(screen.getByText('(1 reseña)')).toBeInTheDocument();
  });
});

