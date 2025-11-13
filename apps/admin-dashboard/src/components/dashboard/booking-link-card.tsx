/**
 * @file booking-link-card.tsx
 * @description Componente para mostrar y compartir el link de reserva del negocio
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Link as LinkIcon, 
  Copy, 
  ExternalLink, 
  Share2,
  QrCode,
  Check,
} from 'lucide-react';

interface BookingLinkCardProps {
  businessSlug: string;
}

export function BookingLinkCard({ businessSlug }: BookingLinkCardProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Construir el link de reserva
  const baseUrl = process.env.NEXT_PUBLIC_WEB_CLIENT_URL || 'http://localhost:3001';
  const bookingLink = `${baseUrl}/${businessSlug}/reservar`;
  const businessPageLink = `${baseUrl}/${businessSlug}`;

  const handleCopyLink = async (link: string, type: 'booking' | 'page') => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast({
        title: '¡Link copiado!',
        description: type === 'booking' 
          ? 'El link de reserva ha sido copiado al portapapeles'
          : 'El link de tu página ha sido copiado al portapapeles',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo copiar el link. Intenta de nuevo.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Reserva tu turno',
          text: '¡Reserva tu turno online de forma fácil y rápida!',
          url: bookingLink,
        });
      } catch (error) {
        // Usuario canceló o error
        console.log('Share cancelled or error:', error);
      }
    } else {
      // Fallback: copiar al portapapeles
      handleCopyLink(bookingLink, 'booking');
    }
  };

  const handleOpenLink = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <LinkIcon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Link de Reserva</CardTitle>
            <CardDescription>
              Comparte este link con tus clientes para que reserven turnos
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Link de Reserva Directa */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Link de Reserva Directa</label>
          <div className="flex gap-2">
            <Input
              value={bookingLink}
              readOnly
              className="font-mono text-sm"
              onClick={(e) => e.currentTarget.select()}
            />
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleCopyLink(bookingLink, 'booking')}
              className="flex-shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleOpenLink(bookingLink)}
              className="flex-shrink-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Este link lleva directamente al formulario de reserva
          </p>
        </div>

        {/* Link de Página del Negocio */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Link de tu Página</label>
          <div className="flex gap-2">
            <Input
              value={businessPageLink}
              readOnly
              className="font-mono text-sm"
              onClick={(e) => e.currentTarget.select()}
            />
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleCopyLink(businessPageLink, 'page')}
              className="flex-shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleOpenLink(businessPageLink)}
              className="flex-shrink-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Muestra información de tu negocio y servicios
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleShare}
            className="flex-1"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Compartir Link
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenLink(bookingLink)}
            className="flex-1"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver Página
          </Button>
        </div>

        {/* Información adicional */}
        <div className="rounded-lg bg-muted/50 p-3 text-sm">
          <p className="font-medium mb-1">💡 Consejos para compartir:</p>
          <ul className="space-y-1 text-muted-foreground text-xs">
            <li>• Comparte el link en tus redes sociales</li>
            <li>• Agrégalo a tu biografía de Instagram/Facebook</li>
            <li>• Envíalo por WhatsApp a tus clientes</li>
            <li>• Inclúyelo en tu firma de email</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

