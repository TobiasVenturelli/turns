/**
 * @file page.tsx
 * @description Página principal del web client - Redirige a la landing
 */

import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirigir a la landing page
  redirect('http://localhost:3003');
}

