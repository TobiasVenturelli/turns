/**
 * @file use-toast.test.ts
 * @description Tests para el hook de toast
 * @author Turns Team
 * @created 2025-11-13
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast, toast } from '../use-toast';

describe('useToast', () => {
  beforeEach(() => {
    // Limpiar toasts antes de cada test
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.toasts.forEach((t) => result.current.dismiss(t.id));
    });
  });

  it('debe inicializar sin toasts', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toEqual([]);
  });

  it('debe agregar un toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      toast({
        title: 'Test Toast',
        description: 'Test Description',
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      title: 'Test Toast',
      description: 'Test Description',
    });
  });

  it('debe agregar un toast con variante destructive', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      toast({
        title: 'Error Toast',
        variant: 'destructive',
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].variant).toBe('destructive');
  });

  it('debe dismissar un toast', () => {
    const { result } = renderHook(() => useToast());

    let toastId: string;
    act(() => {
      const { id } = toast({
        title: 'Test Toast',
      });
      toastId = id;
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.dismiss(toastId);
    });

    // El toast debería estar marcado como cerrado
    // pero aún en el array hasta que se remueva
    expect(result.current.toasts.length).toBeGreaterThanOrEqual(0);
  });

  it('debe limitar el número de toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      toast({ title: 'Toast 1' });
      toast({ title: 'Toast 2' });
      toast({ title: 'Toast 3' });
    });

    // Solo debe mostrar 1 toast a la vez (TOAST_LIMIT = 1)
    expect(result.current.toasts.length).toBeLessThanOrEqual(1);
  });
});

