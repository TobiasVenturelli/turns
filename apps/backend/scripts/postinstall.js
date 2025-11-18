/**
 * Script postinstall para el backend
 * Solo ejecuta prisma generate si DATABASE_URL está disponible
 * Esto evita errores cuando se instala en Vercel para construir frontends
 */

const { execSync } = require('child_process');

if (process.env.DATABASE_URL) {
  console.log('✅ DATABASE_URL encontrado, ejecutando prisma generate...');
  try {
    execSync('prisma generate', { stdio: 'inherit' });
    console.log('✅ prisma generate completado');
  } catch (error) {
    console.warn('⚠️ Error ejecutando prisma generate (puede ser normal en builds de frontend):', error.message);
    process.exit(0); // Salir exitosamente para no romper el build
  }
} else {
  console.log('⏭️  Saltando prisma generate: DATABASE_URL no está disponible (normal en builds de frontend)');
}

