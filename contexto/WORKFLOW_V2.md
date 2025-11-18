# 🚀 Workflow de Desarrollo - Versión 2.0 (Actualizado)

## ⚠️ IMPORTANTE: Arquitectura Correcta

**El cliente NO tiene dashboard**. Ver `ARQUITECTURA_CORRECTA.md` para detalles completos.

- ✅ Web Client: Solo página del negocio + reserva (acceso por link)
- ❌ Web Client: NO tiene lista de negocios, búsqueda, ni dashboard de cliente
- ✅ Admin Dashboard: Exclusivo para profesionales

---

## 🎯 Cambios Principales vs V1.0

### ✅ Nuevas Funcionalidades:

1. **Sistema de múltiples profesionales** por negocio
2. **Cliente elige profesional** al reservar (opcional)
3. **Horarios independientes** por profesional
4. **Flujo simplificado**: Landing → Pago → Dashboard

---

## 🏗️ FASE 3.6: Módulo de Profesionales (NUEVO)

**Objetivo**: Permitir que un negocio tenga múltiples profesionales

**Tiempo estimado**: 4-5 horas

### Backend

#### 3.6.1: Schema de Base de Datos

```prisma
model Business {
  id                         String  @id @default(uuid())
  // ... campos existentes ...

  // 🆕 Configuración de profesionales
  allowMultipleProfessionals Boolean @default(false)
  requireProfessionalSelection Boolean @default(false)

  // Relaciones
  professionals Professional[]
}

model Professional {
  id          String   @id @default(uuid())
  businessId  String
  business    Business @relation(fields: [businessId], references: [id], onDelete: Cascade)

  // Información del profesional
  name        String
  email       String?
  phone       String?
  specialty   String?  // "Corte y color", "Manicura", etc.
  photo       String?
  bio         String?

  // Usuario asociado (opcional)
  userId      String?  @unique
  user        User?    @relation(fields: [userId], references: [id])

  // Estado
  isActive    Boolean  @default(true)
  order       Int      @default(0) // Para ordenar en la UI

  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relaciones
  appointments Appointment[]
  schedules    ProfessionalSchedule[]

  @@map("professionals")
  @@index([businessId])
  @@index([userId])
}

model ProfessionalSchedule {
  id             String       @id @default(uuid())
  professionalId String
  professional   Professional @relation(fields: [professionalId], references: [id], onDelete: Cascade)

  dayOfWeek  Int      // 0-6 (Domingo-Sábado)
  startTime  String   // "09:00"
  endTime    String   // "18:00"
  isActive   Boolean  @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("professional_schedules")
  @@index([professionalId])
}

model Appointment {
  // ... campos existentes ...

  // 🆕 Profesional asignado (opcional)
  professionalId String?
  professional   Professional? @relation(fields: [professionalId], references: [id])
}
```

#### 3.6.2: Endpoints

**Tareas**:

- [ ] Crear módulo `professionals`
- [ ] Implementar CRUD de profesionales
- [ ] Implementar subida de foto de profesional
- [ ] Implementar ordenamiento de profesionales
- [ ] Implementar activar/desactivar profesional
- [ ] Implementar configuración de horarios por profesional
- [ ] Implementar disponibilidad por profesional
- [ ] Actualizar módulo de appointments para incluir professionalId
- [ ] Tests unitarios

**Endpoints creados**:

```typescript
// Gestión de profesionales
POST   /api/v1/business/:businessId/professionals
GET    /api/v1/business/:businessId/professionals
GET    /api/v1/professionals/:id
PUT    /api/v1/professionals/:id
DELETE /api/v1/professionals/:id
POST   /api/v1/professionals/:id/photo
PUT    /api/v1/professionals/:id/order

// Horarios de profesionales
GET /api/v1/professionals/:id/schedule
PUT /api/v1/professionals/:id/schedule

// Disponibilidad
GET /api/v1/professionals/:id/availability?date=2025-11-15
GET /api/v1/business/:businessId/professionals/availability?date=2025-11-15

// Configuración
PUT /api/v1/business/:id/professionals/settings
```

**Resultado**: API de profesionales funcionando

---

## 🎛️ FASE 4.12: Gestión de Profesionales (Admin Dashboard) (NUEVO)

**Objetivo**: Panel para gestionar profesionales del negocio

**Tiempo estimado**: 5-6 horas

### Tareas

#### 4.12.1: Configuración de Profesionales

- [ ] Agregar toggle en `/dashboard/configuracion/negocio`:
  - "¿Tu negocio tiene varios profesionales?"
  - "¿Quieres que los clientes elijan profesional?"
- [ ] Guardar configuración en backend
- [ ] Mostrar/ocultar sección de profesionales según toggle

#### 4.12.2: Página de Profesionales

- [ ] Crear página `/dashboard/profesionales`
- [ ] Listar todos los profesionales
- [ ] Botón "Agregar Profesional"
- [ ] Modal/página de creación:
  - Nombre (requerido)
  - Email (opcional)
  - Teléfono (opcional)
  - Especialidad (opcional)
  - Foto (opcional)
  - Bio (opcional)
- [ ] Editar profesional
- [ ] Eliminar/archivar profesional
- [ ] Ordenar profesionales (drag & drop)
- [ ] Activar/desactivar profesional
- [ ] Ver turnos del profesional

#### 4.12.3: Configuración de Horarios por Profesional

- [ ] En `/dashboard/profesionales/:id/horarios`
- [ ] Configurar días laborables del profesional
- [ ] Configurar horarios por día
- [ ] Heredar horarios del negocio (opción)
- [ ] Vista previa de disponibilidad

#### 4.12.4: Calendario con Profesionales

- [ ] Actualizar `/dashboard/turnos` (FullCalendar)
- [ ] Filtrar por profesional
- [ ] Código de colores por profesional
- [ ] Vista por profesional (columnas)
- [ ] Asignar profesional al crear turno manual

**Páginas creadas**:

```
/dashboard/profesionales
/dashboard/profesionales/nuevo
/dashboard/profesionales/:id/editar
/dashboard/profesionales/:id/horarios
```

**Resultado**: Gestión completa de profesionales en admin

---

## 🎨 FASE 2.4.1: Selección de Profesional (Web Client) (ACTUALIZACIÓN)

**Objetivo**: Cliente puede elegir profesional al reservar

**Tiempo estimado**: 2-3 horas

### Tareas

- [ ] Actualizar wizard de reserva en `/[businessSlug]/reservar`
- [ ] **Nuevo Paso 2**: "Elegir Profesional" (si está habilitado)
  - Mostrar lista de profesionales activos
  - Mostrar foto, nombre y especialidad
  - Opción "Sin preferencia" (cualquier profesional)
  - Filtrar por disponibilidad del servicio
- [ ] Actualizar Paso 3 (Fecha): Filtrar por disponibilidad del profesional
- [ ] Actualizar Paso 4 (Horario): Mostrar slots del profesional
- [ ] Mostrar profesional seleccionado en resumen
- [ ] Guardar professionalId al crear appointment

**Flujo actualizado**:

```
1. Seleccionar servicio
2. Seleccionar profesional (si está habilitado) 🆕
3. Seleccionar fecha
4. Seleccionar horario
5. Datos del cliente
6. Confirmar
```

**Resultado**: Cliente puede elegir profesional al reservar

---

## 📊 Casos de Uso

### Caso 1: Peluquería con 3 Peluqueros

**Configuración**:

```typescript
{
  allowMultipleProfessionals: true,
  requireProfessionalSelection: true,
  professionals: [
    { name: "María", specialty: "Corte y color" },
    { name: "Juan", specialty: "Barbería" },
    { name: "Ana", specialty: "Peinados" }
  ]
}
```

**Flujo del Cliente**:

1. Elige servicio: "Corte de cabello"
2. **Elige profesional**: "María" ✅
3. Elige fecha: "15 Nov 2025"
4. Elige hora: "14:00" (solo slots de María)
5. Confirma reserva

### Caso 2: Manicura (1 Profesional)

**Configuración**:

```typescript
{
  allowMultipleProfessionals: false,
  requireProfessionalSelection: false,
  professionals: [
    { name: "Laura", specialty: "Manicura y pedicura" }
  ]
}
```

**Flujo del Cliente**:

1. Elige servicio: "Manicura completa"
2. ~~Elige profesional~~ (paso omitido) ❌
3. Elige fecha: "15 Nov 2025"
4. Elige hora: "14:00"
5. Confirma reserva

### Caso 3: Spa con Opción Flexible

**Configuración**:

```typescript
{
  allowMultipleProfessionals: true,
  requireProfessionalSelection: false, // Opcional
  professionals: [
    { name: "Sofía", specialty: "Masajes" },
    { name: "Carlos", specialty: "Masajes" }
  ]
}
```

**Flujo del Cliente**:

1. Elige servicio: "Masaje relajante"
2. **Elige profesional** (opcional): "Sin preferencia" ✅
3. Elige fecha: "15 Nov 2025"
4. Elige hora: "14:00" (cualquier profesional disponible)
5. Confirma reserva

---

## 🔄 Migraciones Necesarias

### Migración 1: Agregar Profesionales

```sql
-- Crear tabla de profesionales
CREATE TABLE "professionals" (
  "id" TEXT PRIMARY KEY,
  "businessId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "specialty" TEXT,
  "photo" TEXT,
  "bio" TEXT,
  "userId" TEXT UNIQUE,
  "isActive" BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE,
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL
);

-- Crear tabla de horarios de profesionales
CREATE TABLE "professional_schedules" (
  "id" TEXT PRIMARY KEY,
  "professionalId" TEXT NOT NULL,
  "dayOfWeek" INTEGER NOT NULL,
  "startTime" TEXT NOT NULL,
  "endTime" TEXT NOT NULL,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE
);

-- Agregar campos a Business
ALTER TABLE "businesses"
  ADD COLUMN "allowMultipleProfessionals" BOOLEAN DEFAULT false,
  ADD COLUMN "requireProfessionalSelection" BOOLEAN DEFAULT false;

-- Agregar campo a Appointments
ALTER TABLE "appointments"
  ADD COLUMN "professionalId" TEXT,
  ADD FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE SET NULL;

-- Índices
CREATE INDEX "professionals_businessId_idx" ON "professionals"("businessId");
CREATE INDEX "professionals_userId_idx" ON "professionals"("userId");
CREATE INDEX "professional_schedules_professionalId_idx" ON "professional_schedules"("professionalId");
CREATE INDEX "appointments_professionalId_idx" ON "appointments"("professionalId");
```

### Migración 2: Crear Profesional por Defecto

```typescript
// Para negocios existentes, crear un profesional por defecto
async function createDefaultProfessionals() {
  const businesses = await prisma.business.findMany({
    include: { user: true },
  });

  for (const business of businesses) {
    await prisma.professional.create({
      data: {
        businessId: business.id,
        userId: business.userId,
        name: `${business.user.firstName} ${business.user.lastName}`,
        email: business.user.email,
        phone: business.user.phone,
        isActive: true,
        order: 0,
      },
    });
  }
}
```

---

## 📊 Resumen de Tiempos Actualizados

### Nuevas Fases

| Fase                                   | Tiempo Estimado |
| -------------------------------------- | --------------- |
| 3.6: Módulo de Profesionales (Backend) | 4-5 horas       |
| 4.12: Gestión de Profesionales (Admin) | 5-6 horas       |
| 2.4.1: Selección de Profesional (Web)  | 2-3 horas       |
| **TOTAL NUEVO**                        | **11-14 horas** |

### Total Proyecto V2.0

| Versión                  | Tiempo Total      |
| ------------------------ | ----------------- |
| V1.0 (Original)          | 96-122 horas      |
| V2.0 (Con profesionales) | **107-136 horas** |

---

## ✅ Checklist de Implementación

### Backend

- [ ] Crear modelo `Professional` en Prisma
- [ ] Crear modelo `ProfessionalSchedule` en Prisma
- [ ] Actualizar modelo `Business` (campos nuevos)
- [ ] Actualizar modelo `Appointment` (professionalId)
- [ ] Crear migración
- [ ] Crear seed de profesionales por defecto
- [ ] Crear módulo `professionals` en NestJS
- [ ] Implementar CRUD de profesionales
- [ ] Implementar horarios por profesional
- [ ] Implementar disponibilidad por profesional
- [ ] Actualizar módulo de appointments
- [ ] Tests unitarios

### Admin Dashboard

- [ ] Crear página `/dashboard/profesionales`
- [ ] Implementar lista de profesionales
- [ ] Implementar crear/editar profesional
- [ ] Implementar subida de foto
- [ ] Implementar ordenamiento
- [ ] Implementar activar/desactivar
- [ ] Crear página de horarios por profesional
- [ ] Actualizar calendario (filtro por profesional)
- [ ] Actualizar configuración de negocio (toggles)
- [ ] Actualizar creación manual de turnos

### Web Client

- [ ] Actualizar wizard de reserva
- [ ] Agregar paso "Elegir Profesional"
- [ ] Filtrar disponibilidad por profesional
- [ ] Mostrar profesional en resumen
- [ ] Guardar professionalId al crear appointment
- [ ] Mostrar profesional en "Mis Turnos"

---

## 🎯 Prioridad de Implementación

### Fase 1 (Esencial)

1. ✅ Backend: Modelo y migración
2. ✅ Backend: CRUD de profesionales
3. ✅ Admin: Página de profesionales
4. ✅ Admin: Configuración de negocio (toggles)

### Fase 2 (Importante)

5. ✅ Backend: Horarios por profesional
6. ✅ Admin: Configuración de horarios
7. ✅ Web: Selección de profesional

### Fase 3 (Nice to have)

8. ⚠️ Admin: Calendario con vista por profesional
9. ⚠️ Admin: Reportes por profesional
10. ⚠️ Web: Filtros avanzados de profesionales

---

## 💡 Consideraciones Adicionales

### Permisos y Acceso

**Opción 1: Profesional sin usuario**

- Solo un nombre en el sistema
- El dueño gestiona todo

**Opción 2: Profesional con usuario**

- Puede tener su propio login
- Ve solo sus turnos
- Puede gestionar su horario
- No puede ver otros profesionales

**Recomendación**: Empezar con Opción 1, agregar Opción 2 en v2.1

### Notificaciones

- [ ] Email al profesional cuando le asignan un turno
- [ ] Email al cliente con nombre del profesional
- [ ] Recordatorio menciona al profesional

### Reportes

- [ ] Turnos por profesional
- [ ] Ingresos por profesional
- [ ] Ocupación por profesional
- [ ] Servicios más solicitados por profesional

---

**Fecha de Actualización**: 13 de Noviembre, 2025  
**Versión**: 2.0  
**Cambios principales**: Sistema de múltiples profesionales
