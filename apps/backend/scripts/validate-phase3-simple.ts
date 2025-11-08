/**
 * @file validate-phase3-simple.ts
 * @description Script de validación simplificado para Fase 3
 * @author Turns Team
 * @created 2025-11-08
 */

import * as fs from 'fs';
import * as path from 'path';

interface ValidationResult {
  name: string;
  status: 'ok' | 'error' | 'warning';
  message: string;
}

const results: ValidationResult[] = [];

function checkFileExists(filePath: string, name: string): boolean {
  const exists = fs.existsSync(filePath);
  results.push({
    name,
    status: exists ? 'ok' : 'error',
    message: exists
      ? `Archivo encontrado`
      : `Archivo no encontrado: ${filePath}`,
  });
  return exists;
}

function checkModuleStructure(modulePath: string, moduleName: string): void {
  const files = [
    `${modulePath}.module.ts`,
    `${modulePath}.service.ts`,
    `${modulePath}.controller.ts`,
  ];

  files.forEach((file) => {
    const fullPath = path.join(__dirname, '..', 'src', file);
    checkFileExists(fullPath, `${moduleName}: ${file}`);
  });
}

console.log('🔍 Validando estructura de Fase 3...\n');

// Verificar módulos principales
console.log('📦 Verificando módulos...');
checkModuleStructure('businesses/businesses', 'Businesses');
checkModuleStructure('services/services', 'Services');
checkModuleStructure('schedules/schedules', 'Schedules');
checkModuleStructure('notifications/notifications', 'Notifications');

// Verificar DTOs
console.log('\n📝 Verificando DTOs...');
const dtos = [
  'businesses/dto/create-business.dto.ts',
  'businesses/dto/update-business.dto.ts',
  'services/dto/create-service.dto.ts',
  'services/dto/update-service.dto.ts',
  'schedules/dto/create-schedule.dto.ts',
  'schedules/dto/update-schedule.dto.ts',
  'schedules/dto/bulk-update-schedules.dto.ts',
  'appointments/dto/update-appointment.dto.ts',
  'appointments/dto/reschedule-appointment.dto.ts',
  'notifications/dto/send-email.dto.ts',
];

dtos.forEach((dto) => {
  const fullPath = path.join(__dirname, '..', 'src', dto);
  checkFileExists(fullPath, `DTO: ${dto}`);
});

// Verificar que AppModule importa todos los módulos
console.log('\n🔗 Verificando AppModule...');
const appModulePath = path.join(__dirname, '..', 'src', 'app.module.ts');
if (fs.existsSync(appModulePath)) {
  const content = fs.readFileSync(appModulePath, 'utf-8');
  const modules = [
    'BusinessesModule',
    'ServicesModule',
    'SchedulesModule',
    'NotificationsModule',
    'AppointmentsModule',
  ];

  modules.forEach((module) => {
    const imported = content.includes(module);
    results.push({
      name: `AppModule importa ${module}`,
      status: imported ? 'ok' : 'error',
      message: imported ? `Importado correctamente` : `No importado`,
    });
  });
}

// Resumen
console.log('\n📊 Resumen de validación:\n');
const ok = results.filter((r) => r.status === 'ok').length;
const errors = results.filter((r) => r.status === 'error').length;
const warnings = results.filter((r) => r.status === 'warning').length;

results.forEach((result) => {
  const icon =
    result.status === 'ok' ? '✅' : result.status === 'error' ? '❌' : '⚠️';
  console.log(`${icon} ${result.name}: ${result.message}`);
});

console.log(`\n📈 Estadísticas:`);
console.log(`   ✅ Correctos: ${ok}`);
console.log(`   ❌ Errores: ${errors}`);
console.log(`   ⚠️  Advertencias: ${warnings}`);

if (errors === 0) {
  console.log(
    '\n🎉 ¡Validación exitosa! Todos los archivos están en su lugar.',
  );
  process.exit(0);
} else {
  console.log(
    '\n⚠️  Se encontraron errores. Por favor revisa los archivos faltantes.',
  );
  process.exit(1);
}
