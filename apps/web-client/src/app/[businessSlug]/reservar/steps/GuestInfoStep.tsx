/**
 * @file GuestInfoStep.tsx
 * @description Paso para recopilar información del cliente no autenticado
 */

'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface GuestInfoStepProps {
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  onGuestInfoChange: (info: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }) => void;
}

export function GuestInfoStep({ guestInfo, onGuestInfoChange }: GuestInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof typeof guestInfo, value: string) => {
    onGuestInfoChange({
      ...guestInfo,
      [field]: value,
    });

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    // Permitir números con o sin espacios, guiones, paréntesis
    const phoneRegex = /^[\d\s\-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 8;
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Para continuar con tu reserva, necesitamos algunos datos de contacto.
          Si ya tienes cuenta, puedes{' '}
          <a href="/login" className="font-medium underline">
            iniciar sesión aquí
          </a>
          .
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            Nombre <span className="text-destructive">*</span>
          </Label>
          <Input
            id="firstName"
            placeholder="Juan"
            value={guestInfo.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className={errors.firstName ? 'border-destructive' : ''}
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">
            Apellido <span className="text-destructive">*</span>
          </Label>
          <Input
            id="lastName"
            placeholder="Pérez"
            value={guestInfo.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className={errors.lastName ? 'border-destructive' : ''}
          />
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="juan@ejemplo.com"
          value={guestInfo.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => {
            if (guestInfo.email && !validateEmail(guestInfo.email)) {
              setErrors((prev) => ({
                ...prev,
                email: 'Email inválido',
              }));
            }
          }}
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Te enviaremos la confirmación a este email
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">
          Teléfono <span className="text-destructive">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+54 9 11 1234-5678"
          value={guestInfo.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          onBlur={() => {
            if (guestInfo.phone && !validatePhone(guestInfo.phone)) {
              setErrors((prev) => ({
                ...prev,
                phone: 'Teléfono inválido (mínimo 8 dígitos)',
              }));
            }
          }}
          className={errors.phone ? 'border-destructive' : ''}
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Para contactarte en caso de ser necesario
        </p>
      </div>
    </div>
  );
}

