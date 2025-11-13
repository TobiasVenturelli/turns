import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Turns - Gestiona tu Negocio de Belleza Online",
  description: "Sistema completo de gestión de turnos para peluquerías, barberías y salones de belleza. Reservas online, pagos automáticos y más.",
  keywords: "turnos online, gestión de turnos, peluquería, barbería, salón de belleza, reservas online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

