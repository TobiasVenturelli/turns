/**
 * @file BusinessRating.tsx
 * @description Componente para mostrar la valoración y reseñas del negocio
 * @author Turns Team
 * @created 2025-11-07
 */

import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BusinessRatingProps {
  rating: number;
  reviewCount: number;
}

/**
 * Componente que muestra la valoración del negocio con estrellas
 */
export function BusinessRating({ rating, reviewCount }: BusinessRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Valoración</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {Array.from({ length: fullStars }).map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-yellow-400 text-yellow-400"
              />
            ))}
            {hasHalfStar && (
              <Star className="h-5 w-5 fill-yellow-400/50 text-yellow-400" />
            )}
            {Array.from({ length: emptyStars }).map((_, i) => (
              <Star
                key={i + fullStars + (hasHalfStar ? 1 : 0)}
                className="h-5 w-5 text-muted-foreground"
              />
            ))}
          </div>
          <div className="ml-2">
            <span className="text-lg font-semibold">{rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              {' '}({reviewCount} {reviewCount === 1 ? 'reseña' : 'reseñas'})
            </span>
          </div>
        </div>
        {reviewCount === 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            Aún no hay reseñas. Sé el primero en dejar una valoración.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

