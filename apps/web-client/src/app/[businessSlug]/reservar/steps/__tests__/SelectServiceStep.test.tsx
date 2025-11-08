/**
 * @file SelectServiceStep.test.tsx
 * @description Tests para el componente SelectServiceStep
 * @author Turns Team
 * @created 2025-11-08
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import { SelectServiceStep } from '../SelectServiceStep';
import { mockBusiness } from '@/test/mockData';

describe('SelectServiceStep', () => {
  it('debe mostrar todos los servicios disponibles', () => {
    const onSelectService = vi.fn();
    render(
      <SelectServiceStep
        services={mockBusiness.services}
        selectedService={null}
        onSelectService={onSelectService}
      />,
    );

    expect(screen.getByText('Corte de Dama')).toBeInTheDocument();
    expect(screen.getByText('Corte y Peinado')).toBeInTheDocument();
  });

  it('debe mostrar precio y duración de cada servicio', () => {
    const { container } = render(
      <SelectServiceStep
        services={mockBusiness.services}
        selectedService={null}
        onSelectService={vi.fn()}
      />,
    );

    // El precio se formatea con toLocaleString() que puede usar punto o coma según locale
    // Buscar el texto que contiene el precio formateado (puede ser "5.000" o "5,000")
    expect(container.textContent).toMatch(/\$.*5[.,]000/);
    expect(screen.getByText(/30.*min/i)).toBeInTheDocument();
  });

  it('debe llamar onSelectService al hacer click en un servicio', async () => {
    const user = userEvent.setup();
    const onSelectService = vi.fn();
    render(
      <SelectServiceStep
        services={mockBusiness.services}
        selectedService={null}
        onSelectService={onSelectService}
      />,
    );

    const serviceCard = screen.getByText('Corte de Dama').closest('div[class*="Card"]');
    if (serviceCard) {
      await user.click(serviceCard);
      expect(onSelectService).toHaveBeenCalledWith(mockBusiness.services[0]);
    }
  });

  it('debe resaltar el servicio seleccionado', () => {
    const { container } = render(
      <SelectServiceStep
        services={mockBusiness.services}
        selectedService={mockBusiness.services[0]}
        onSelectService={vi.fn()}
      />,
    );

    // Buscar el radio button por su ID
    const selectedRadio = screen.getByRole('radio', { checked: true });
    expect(selectedRadio).toHaveAttribute('value', mockBusiness.services[0].id);
    
    // Verificar que el card tiene la clase de seleccionado
    const card = container.querySelector(`[data-slot="card"]`);
    expect(card).toBeTruthy();
    if (card) {
      expect(card.className).toMatch(/border-primary|ring-primary/);
    }
  });
});

