/**
 * Script para crear usuario de prueba en la base de datos
 */

import { PrismaClient, UserRole, AuthProvider } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createTestUser() {
  console.log('🔧 Creando usuario de prueba...');

  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'profesional@test.com' },
    });

    if (existingUser) {
      console.log('✅ El usuario profesional@test.com ya existe');
      console.log('   ID:', existingUser.id);
      console.log('   Nombre:', existingUser.firstName, existingUser.lastName);
      return;
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    // Crear el usuario profesional
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

    console.log('✅ Usuario profesional creado exitosamente:');
    console.log('   Email: profesional@test.com');
    console.log('   Password: Password123!');
    console.log('   ID:', professional.id);
    console.log('   Nombre:', professional.firstName, professional.lastName);
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser()
  .then(() => {
    console.log('✨ Proceso completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
