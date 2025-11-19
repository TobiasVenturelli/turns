/**
 * Script para crear negocio de prueba
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestBusiness() {
  console.log('🏢 Creando negocio de prueba...');

  try {
    // Buscar el usuario profesional
    const professional = await prisma.user.findUnique({
      where: { email: 'profesional@test.com' },
      include: { business: true },
    });

    if (!professional) {
      console.error('❌ Usuario profesional no encontrado');
      return;
    }

    if (professional.business) {
      console.log('✅ El negocio ya existe:');
      console.log('   Nombre:', professional.business.name);
      console.log('   Slug:', professional.business.slug);
      console.log(
        '   URL:',
        `http://localhost:3001/${professional.business.slug}`,
      );
      return;
    }

    // Crear el negocio
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

    console.log('✅ Negocio creado exitosamente:');
    console.log('   Nombre:', business.name);
    console.log('   Slug:', business.slug);
    console.log('   URL Web Client:', `http://localhost:3001/${business.slug}`);
    console.log('   ID:', business.id);
  } catch (error) {
    console.error('❌ Error al crear negocio:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createTestBusiness()
  .then(() => {
    console.log('✨ Proceso completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
