/**
 * @file [businessSlug]/reservar/page.tsx
 * @description Página de reserva de turnos con wizard
 * @author Turns Team
 * @created 2025-11-07
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { businessService } from '@/services/business.service';
import { appointmentService } from '@/services/appointment.service';
import type { BusinessWithRelations, Service } from '@/types';

// Componentes de los pasos del wizard
import { SelectServiceStep } from './steps/SelectServiceStep';
import { SelectDateStep } from './steps/SelectDateStep';
import { SelectTimeStep } from './steps/SelectTimeStep';
import { ConfirmationStep } from './steps/ConfirmationStep';

const STEPS = [
  { id: 1, title: 'Servicio', icon: Calendar },
  { id: 2, title: 'Fecha', icon: Calendar },
  { id: 3, title: 'Horario', icon: Clock },
  { id: 4, title: 'Confirmar', icon: CheckCircle },
];

export default function ReservarPage() {
  const params = useParams();
  const router = useRouter();
  const businessSlug = params.businessSlug as string;

  const [currentStep, setCurrentStep] = useState(1);
  const [business, setBusiness] = useState<BusinessWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  // Estado del wizard
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadBusiness();
  }, [businessSlug]);

  const loadBusiness = async () => {
    try {
      setLoading(true);
      const data = await businessService.getBusinessBySlug(businessSlug);
      setBusiness(data);
    } catch (error) {
      console.error('Error loading business:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    if (currentStep === STEPS.length) {
      // Confirmar reserva
      await handleConfirmReservation();
    } else if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleConfirmReservation = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !business) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Construir las fechas de inicio y fin
      const dateStr = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const startDateTime = new Date(`${dateStr}T${selectedTime}:00`);
      const endDateTime = new Date(startDateTime.getTime() + selectedService.duration * 60000);

      await appointmentService.createAppointment({
        businessId: business.id,
        serviceId: selectedService.id,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        notes: notes || undefined,
      });

      // Redirigir a página de éxito o dashboard
      router.push(`/${businessSlug}/reserva-confirmada`);
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      alert(error.response?.data?.message || 'Error al confirmar la reserva. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return selectedService !== null;
      case 2:
        return selectedDate !== undefined;
      case 3:
        return selectedTime !== null;
      case 4:
        return true;
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push(`/${businessSlug}`)}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al negocio
            </Button>
            <h1 className="text-3xl font-bold">Reservar Turno</h1>
            <p className="text-muted-foreground">{business.name}</p>
          </div>

          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div key={step.id} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                          isActive
                            ? 'border-primary bg-primary text-primary-foreground'
                            : isCompleted
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-muted bg-background text-muted-foreground'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <Icon className="h-6 w-6" />
                        )}
                      </div>
                      <p
                        className={`mt-2 text-sm font-medium ${
                          isActive || isCompleted
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                    {index < STEPS.length - 1 && (
                      <Separator
                        className={`mx-2 flex-1 ${
                          isCompleted ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                Paso {currentStep}: {STEPS[currentStep - 1].title}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && 'Selecciona el servicio que deseas reservar'}
                {currentStep === 2 && 'Elige la fecha para tu turno'}
                {currentStep === 3 && 'Selecciona el horario disponible'}
                {currentStep === 4 && 'Revisa y confirma tu reserva'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step Content */}
              {currentStep === 1 && (
                <SelectServiceStep
                  services={business.services}
                  selectedService={selectedService}
                  onSelectService={setSelectedService}
                />
              )}
              {currentStep === 2 && (
                <SelectDateStep
                  schedules={business.schedules}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
              )}
              {currentStep === 3 && selectedService && selectedDate && (
                <SelectTimeStep
                  businessId={business.id}
                  serviceId={selectedService.id}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onSelectTime={setSelectedTime}
                />
              )}
              {currentStep === 4 && selectedService && selectedDate && selectedTime && (
                <ConfirmationStep
                  business={business}
                  service={selectedService}
                  date={selectedDate}
                  time={selectedTime}
                  notes={notes}
                  onNotesChange={setNotes}
                />
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
                <Button
                  onClick={handleNextStep}
                  disabled={!canProceedToNextStep() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                      Procesando...
                    </>
                  ) : currentStep === STEPS.length ? (
                    <>
                      Confirmar Reserva
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Siguiente
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

