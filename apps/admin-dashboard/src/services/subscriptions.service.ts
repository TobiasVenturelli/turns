/**
 * @file subscriptions.service.ts
 * @description Servicio para gestionar suscripciones en el Admin Dashboard
 */

import { api } from '@/lib/axios';

// Tipos
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  interval: string;
  features: {
    maxServices?: number;
    maxAppointmentsPerMonth?: number;
    analytics?: boolean;
    customBranding?: boolean;
    prioritySupport?: boolean;
    multipleLocations?: boolean;
    [key: string]: any;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  businessId: string;
  planId: string;
  plan: SubscriptionPlan;
  status: 'TRIAL' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEndsAt: string | null;
  mercadopagoSubscriptionId: string | null;
  mercadopagoPreapprovalId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionStatus {
  isActive: boolean;
  daysRemaining: number | null;
}

/**
 * Obtener todos los planes de suscripción disponibles
 */
export const getPlans = async (): Promise<SubscriptionPlan[]> => {
  const response = await api.get('/subscriptions/plans');
  return response.data;
};

/**
 * Obtener un plan específico por ID
 */
export const getPlanById = async (planId: string): Promise<SubscriptionPlan> => {
  const response = await api.get(`/subscriptions/plans/${planId}`);
  return response.data;
};

/**
 * Obtener la suscripción actual del negocio
 */
export const getCurrentSubscription = async (): Promise<Subscription> => {
  const response = await api.get('/subscriptions/current');
  return response.data;
};

/**
 * Obtener el estado de la suscripción (activa o no, días restantes)
 */
export const getSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
  const response = await api.get('/subscriptions/status');
  return response.data;
};

/**
 * Crear una nueva suscripción (con trial de 7 días)
 */
export const createSubscription = async (planId: string): Promise<Subscription> => {
  const response = await api.post('/subscriptions', { planId });
  return response.data;
};

/**
 * Cambiar el plan de suscripción
 */
export const changePlan = async (newPlanId: string): Promise<Subscription> => {
  const response = await api.put(`/subscriptions/change-plan/${newPlanId}`);
  return response.data;
};

/**
 * Cancelar suscripción (se cancela al final del período)
 */
export const cancelSubscription = async (): Promise<Subscription> => {
  const response = await api.delete('/subscriptions/cancel');
  return response.data;
};

/**
 * Reactivar una suscripción cancelada
 */
export const reactivateSubscription = async (): Promise<Subscription> => {
  const response = await api.post('/subscriptions/reactivate');
  return response.data;
};

/**
 * Crear preferencia de pago para activar suscripción Pro después del trial
 */
export const createPaymentPreference = async (): Promise<{
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
  planId: string;
  planName: string;
  price: number;
  currency: string;
}> => {
  const response = await api.post('/subscriptions/payment-preference');
  return response.data;
};

/**
 * Activar suscripción después de pago exitoso
 */
export const activateAfterPayment = async (
  paymentId?: string,
): Promise<Subscription> => {
  const response = await api.post('/subscriptions/activate-after-payment', {
    paymentId,
  });
  return response.data;
};

