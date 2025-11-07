/**
 * @file SelectServiceStep.tsx
 * @description Paso 1 - Seleccionar servicio
 * @author Turns Team
 * @created 2025-11-07
 */

'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Clock, DollarSign } from 'lucide-react';
import type { Service } from '@/types';

interface SelectServiceStepProps {
  services: Service[];
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
}

export function SelectServiceStep({
  services,
  selectedService,
  onSelectService,
}: SelectServiceStepProps) {
  return (
    <div className="space-y-4">
      <RadioGroup
        value={selectedService?.id}
        onValueChange={(value) => {
          const service = services.find((s) => s.id === value);
          if (service) onSelectService(service);
        }}
      >
        {services.map((service) => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-all ${
              selectedService?.id === service.id
                ? 'border-primary ring-2 ring-primary'
                : 'hover:border-primary/50'
            }`}
            onClick={() => onSelectService(service)}
          >
            <div className="flex items-start gap-4 p-4">
              <RadioGroupItem value={service.id} id={service.id} className="mt-1" />
              <div className="flex-1">
                <Label htmlFor={service.id} className="cursor-pointer">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="font-semibold">{service.name}</h3>
                    <span className="text-lg font-bold text-primary">
                      ${service.price.toLocaleString()}
                    </span>
                  </div>
                  {service.description && (
                    <p className="mb-3 text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${service.price.toLocaleString()}</span>
                    </div>
                  </div>
                </Label>
              </div>
            </div>
          </Card>
        ))}
      </RadioGroup>
    </div>
  );
}

