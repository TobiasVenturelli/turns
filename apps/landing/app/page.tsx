/**
 * @file page.tsx
 * @description Landing page de Turns
 */

import Link from 'next/link';
import { 
  Calendar, 
  CreditCard, 
  Users, 
  Link as LinkIcon,
  BarChart3,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Smartphone,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">Turns</span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="#caracteristicas" 
                className="text-gray-600 hover:text-gray-900 hidden md:block"
              >
                Características
              </Link>
              <Link 
                href="#precios" 
                className="text-gray-600 hover:text-gray-900 hidden md:block"
              >
                Precios
              </Link>
              <Link 
                href="http://localhost:3002/login"
                className="text-gray-600 hover:text-gray-900"
              >
                Iniciar Sesión
              </Link>
              <Link 
                href="http://localhost:3002/register"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Comenzar Gratis
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Gestiona tu Negocio de Belleza de Forma Simple
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Reservas online, pagos automáticos y clientes felices. 
              Todo en una sola plataforma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="http://localhost:3002/register"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Comenzar Gratis - 7 Días
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                href="#demo"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Ver Demo
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              ✓ Sin tarjeta de crédito  ✓ 7 días gratis  ✓ Cancela cuando quieras
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Todo lo que necesitas</h2>
            <p className="text-xl text-gray-600">
              Herramientas profesionales para hacer crecer tu negocio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Calendario Inteligente</h3>
              <p className="text-gray-600">
                Gestiona todos tus turnos con vista diaria, semanal y mensual. 
                Sincronización en tiempo real.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pagos Automáticos</h3>
              <p className="text-gray-600">
                Recibe pagos online con Mercado Pago. Tus clientes pueden pagar 
                seña al reservar.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestión de Clientes</h3>
              <p className="text-gray-600">
                Base de datos completa con historial, estadísticas y notas 
                de cada cliente.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <LinkIcon className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Link de Reserva</h3>
              <p className="text-gray-600">
                Comparte tu link único y recibe reservas 24/7 sin atender 
                el teléfono.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reportes y Estadísticas</h3>
              <p className="text-gray-600">
                Analiza tus ingresos, servicios más solicitados y horarios 
                más ocupados.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Responsive</h3>
              <p className="text-gray-600">
                Funciona perfectamente en celular, tablet y computadora. 
                Gestiona desde cualquier lugar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precios" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Un Plan, Todo Incluido</h2>
            <p className="text-xl text-gray-600">
              Todas las funcionalidades que necesitas para hacer crecer tu negocio
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            {/* Plan Pro - Único */}
            <div className="bg-white p-10 rounded-2xl border-2 border-blue-600 shadow-2xl relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                ⭐ Plan Profesional
              </div>
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-4">Plan PRO</h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold">$20,000</span>
                  <span className="text-gray-600 text-xl">/mes</span>
                </div>
                <p className="text-green-600 font-semibold">
                  🎉 7 días de prueba gratis
                </p>
              </div>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Turnos Ilimitados</span>
                    <p className="text-sm text-gray-600">Gestiona todos los turnos que necesites</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Servicios Ilimitados</span>
                    <p className="text-sm text-gray-600">Crea todos los servicios que ofreces</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Pagos Online con Mercado Pago</span>
                    <p className="text-sm text-gray-600">Recibe pagos automáticos y señas</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Link de Reserva Personalizado</span>
                    <p className="text-sm text-gray-600">Comparte tu link y recibe reservas 24/7</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Calendario Inteligente</span>
                    <p className="text-sm text-gray-600">Vista diaria, semanal y mensual</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Gestión de Clientes</span>
                    <p className="text-sm text-gray-600">Base de datos completa con historial</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Reportes y Estadísticas</span>
                    <p className="text-sm text-gray-600">Analiza ingresos y rendimiento</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Soporte Prioritario</span>
                    <p className="text-sm text-gray-600">Asistencia rápida cuando la necesites</p>
                  </div>
                </li>
              </ul>
              
              <Link 
                href="http://localhost:3002/register"
                className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Comenzar Prueba Gratis de 7 Días
              </Link>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                ✓ Sin tarjeta de crédito  •  ✓ Cancela cuando quieras
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            ¿Listo para Transformar tu Negocio?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a cientos de profesionales que ya confían en Turns
          </p>
          <Link 
            href="http://localhost:3002/register"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Comenzar Gratis - 7 Días
          </Link>
          <p className="mt-4 text-sm opacity-75">
            Sin tarjeta de crédito • Cancela cuando quieras
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-6 w-6" />
                <span className="text-xl font-bold">Turns</span>
              </div>
              <p className="text-gray-400">
                Gestión de turnos simple y profesional
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#caracteristicas" className="hover:text-white">Características</a></li>
                <li><a href="#precios" className="hover:text-white">Precios</a></li>
                <li><a href="#demo" className="hover:text-white">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Términos de Uso</a></li>
                <li><a href="#" className="hover:text-white">Privacidad</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Turns. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

