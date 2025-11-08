/**
 * @file reserva-flow.spec.ts
 * @description Test E2E del flujo completo de reserva
 * @author Turns Team
 * @created 2025-11-08
 */

import { test, expect } from '@playwright/test';

test.describe('Flujo de Reserva de Turnos', () => {
  test.beforeEach(async ({ page }) => {
    // Mock del backend - en producción esto debería conectarse al backend real
    await page.route('**/api/v1/businesses/*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'business-1',
          name: 'Peluquería María',
          slug: 'peluqueria-maria',
          description: 'Servicios profesionales',
          services: [
            {
              id: 'service-1',
              name: 'Corte de Dama',
              description: 'Corte moderno',
              duration: 30,
              price: 5000,
            },
          ],
          schedules: [
            {
              dayOfWeek: 1,
              startTime: '09:00',
              endTime: '18:00',
              isActive: true,
            },
          ],
        }),
      });
    });

    await page.route('**/api/v1/appointments/available-slots**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { startTime: '09:00', endTime: '09:30', available: true },
          { startTime: '10:00', endTime: '10:30', available: true },
          { startTime: '11:00', endTime: '11:30', available: true },
        ]),
      });
    });

    await page.route('**/api/v1/appointments', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'appointment-1',
          status: 'CONFIRMED',
        }),
      });
    });
  });

  test('debe completar el flujo completo de reserva', async ({ page }) => {
    // 1. Ir a la página del negocio
    await page.goto('/peluqueria-maria');
    await expect(page.getByRole('heading', { name: /Peluquería María/i })).toBeVisible();

    // 2. Click en "Reservar Turno"
    await page.getByRole('button', { name: /Reservar Turno/i }).first().click();
    await expect(page).toHaveURL(/.*\/reservar/);

    // 3. Paso 1: Seleccionar servicio
    await expect(page.getByText(/Paso 1: Servicio/i)).toBeVisible();
    await page.getByText(/Corte de Dama/i).click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // 4. Paso 2: Seleccionar fecha
    await expect(page.getByText(/Paso 2: Fecha/i)).toBeVisible();
    // Seleccionar una fecha disponible (próximo lunes)
    const nextMonday = new Date();
    nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7));
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // 5. Paso 3: Seleccionar horario
    await expect(page.getByText(/Paso 3: Horario/i)).toBeVisible();
    await page.getByText(/09:00/i).first().click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // 6. Paso 4: Confirmar
    await expect(page.getByText(/Paso 4: Confirmar/i)).toBeVisible();
    await expect(page.getByText(/Corte de Dama/i)).toBeVisible();
    await page.getByRole('button', { name: /Confirmar Reserva/i }).click();

    // 7. Verificar página de confirmación
    await expect(page).toHaveURL(/.*\/reserva-confirmada/);
    await expect(page.getByText(/Reserva Confirmada/i)).toBeVisible();
  });

  test('debe validar que no se puede avanzar sin seleccionar servicio', async ({ page }) => {
    await page.goto('/peluqueria-maria/reservar');

    // Intentar avanzar sin seleccionar servicio
    const nextButton = page.getByRole('button', { name: /Siguiente/i });
    await expect(nextButton).toBeDisabled();
  });

  test('debe poder volver al paso anterior', async ({ page }) => {
    await page.goto('/peluqueria-maria/reservar');

    // Seleccionar servicio y avanzar
    await page.getByText(/Corte de Dama/i).click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Volver al paso anterior
    await page.getByRole('button', { name: /Anterior/i }).click();
    await expect(page.getByText(/Paso 1: Servicio/i)).toBeVisible();
  });
});

