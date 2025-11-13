'use client';

import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

export type AppointmentFilter = 'upcoming' | 'past' | 'cancelled' | 'all';

interface AppointmentFiltersProps {
  activeFilter: AppointmentFilter;
  onFilterChange: (filter: AppointmentFilter) => void;
  counts?: {
    upcoming: number;
    past: number;
    cancelled: number;
    all: number;
  };
}

export function AppointmentFilters({
  activeFilter,
  onFilterChange,
  counts,
}: AppointmentFiltersProps) {
  const filters: Array<{
    value: AppointmentFilter;
    label: string;
    icon: React.ElementType;
  }> = [
    { value: 'upcoming', label: 'Próximos', icon: Calendar },
    { value: 'past', label: 'Pasados', icon: Clock },
    { value: 'cancelled', label: 'Cancelados', icon: XCircle },
    { value: 'all', label: 'Todos', icon: CheckCircle },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.value;
        const count = counts?.[filter.value];

        return (
          <Button
            key={filter.value}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(filter.value)}
            className="gap-2"
          >
            <Icon className="h-4 w-4" />
            {filter.label}
            {count !== undefined && (
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                  isActive
                    ? 'bg-primary-foreground/20'
                    : 'bg-muted'
                }`}
              >
                {count}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}

