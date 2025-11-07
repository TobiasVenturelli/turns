/**
 * @file seed.ts
 * @description Script para poblar la base de datos con datos iniciales
 * @author Turns Team
 * @created 2025-11-07
 */

import { PrismaClient, UserRole, AuthProvider } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Función principal de seed
 */
async function main() {
  console.log('🌱 Iniciando seed de base de datos...');

  // Limpiar base de datos
  await prisma.appointment.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.service.deleteMany();
  await prisma.business.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Base de datos limpiada');

  // Crear usuarios de prueba
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // Cliente de prueba
  const customer = await prisma.user.create({
    data: {
      email: 'cliente@test.com',
      password: hashedPassword,
      firstName: 'Juan',
      lastName: 'Pérez',
      phone: '+54911234567',
      role: UserRole.CUSTOMER,
      authProvider: AuthProvider.LOCAL,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  console.log('👤 Cliente creado:', customer.email);

  // Profesional de prueba
  const professional = await prisma.user.create({
    data: {
      email: 'profesional@test.com',
      password: hashedPassword,
      firstName: 'María',
      lastName: 'García',
      phone: '+54911234568',
      role: UserRole.PROFESSIONAL,
      authProvider: AuthProvider.LOCAL,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  console.log('💼 Profesional creado:', professional.email);

  // Crear negocio para el profesional
  const business = await prisma.business.create({
    data: {
      name: 'Peluquería María',
      slug: 'peluqueria-maria',
      description:
        'Peluquería y centro de belleza con más de 10 años de experiencia',
      phone: '+54911234568',
      email: 'info@peluqueriamaria.com',
      address: 'Av. Corrientes 1234',
      city: 'Buenos Aires',
      state: 'CABA',
      country: 'Argentina',
      zipCode: '1043',
      shareableLink: 'turns.app/peluqueria-maria',
      userId: professional.id,
    },
  });

  console.log('🏢 Negocio creado:', business.name);

  // Crear servicios
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Corte de Cabello',
        description: 'Corte de cabello para hombre o mujer',
        duration: 30,
        price: 3000,
        businessId: business.id,
        color: '#FF5733',
      },
    }),
    prisma.service.create({
      data: {
        name: 'Tintura',
        description: 'Tintura completa con productos de primera calidad',
        duration: 90,
        price: 8000,
        businessId: business.id,
        color: '#33FF57',
      },
    }),
    prisma.service.create({
      data: {
        name: 'Manicura',
        description: 'Manicura completa con esmaltado',
        duration: 45,
        price: 2500,
        businessId: business.id,
        color: '#3357FF',
      },
    }),
    prisma.service.create({
      data: {
        name: 'Pedicura',
        description: 'Pedicura completa con tratamiento de uñas',
        duration: 60,
        price: 3500,
        businessId: business.id,
        color: '#F333FF',
      },
    }),
  ]);

  console.log(`💅 ${services.length} servicios creados`);

  // Crear horarios de trabajo (Lunes a Viernes)
  const schedules = await Promise.all([
    // Lunes
    prisma.schedule.create({
      data: {
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '18:00',
        businessId: business.id,
      },
    }),
    // Martes
    prisma.schedule.create({
      data: {
        dayOfWeek: 2,
        startTime: '09:00',
        endTime: '18:00',
        businessId: business.id,
      },
    }),
    // Miércoles
    prisma.schedule.create({
      data: {
        dayOfWeek: 3,
        startTime: '09:00',
        endTime: '18:00',
        businessId: business.id,
      },
    }),
    // Jueves
    prisma.schedule.create({
      data: {
        dayOfWeek: 4,
        startTime: '09:00',
        endTime: '18:00',
        businessId: business.id,
      },
    }),
    // Viernes
    prisma.schedule.create({
      data: {
        dayOfWeek: 5,
        startTime: '09:00',
        endTime: '19:00',
        businessId: business.id,
      },
    }),
    // Sábado
    prisma.schedule.create({
      data: {
        dayOfWeek: 6,
        startTime: '10:00',
        endTime: '14:00',
        businessId: business.id,
      },
    }),
  ]);

  console.log(`📅 ${schedules.length} horarios creados`);

  console.log('✅ Seed completado exitosamente');
  console.log('\n📝 Usuarios de prueba:');
  console.log('  Cliente: cliente@test.com / Password123!');
  console.log('  Profesional: profesional@test.com / Password123!');
}

// Ejecutar seed
main()
  .catch((error) => {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
