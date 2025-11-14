# 🧪 Guía de Prueba: WebSockets en Tiempo Real

## ✅ Estado de los Servidores

- ✅ **Backend** (Puerto 3000): Corriendo
- ✅ **Web Client** (Puerto 3001): Corriendo
- ✅ **Admin Dashboard** (Puerto 3002): Corriendo
- ✅ **Landing** (Puerto 3003): Corriendo

---

## 🧪 Pruebas a Realizar

### 1. **Prueba de Conexión WebSocket**

#### Desde Admin Dashboard (Profesional):

1. Abre el navegador en `http://localhost:3002`
2. Inicia sesión como profesional
3. Abre la consola del navegador (F12)
4. Deberías ver: `✅ Conectado al servidor de WebSockets`

#### Desde Web Client (Cliente):

1. Abre el navegador en `http://localhost:3001`
2. Inicia sesión como cliente
3. Abre la consola del navegador (F12)
4. Deberías ver: `✅ Conectado al servidor de WebSockets`

---

### 2. **Prueba de Notificaciones en Tiempo Real**

#### Escenario 1: Cliente reserva un turno

**Pasos:**

1. En el **Web Client** (`http://localhost:3001`), como cliente:
   - Navega a la página de un negocio
   - Reserva un nuevo turno

2. En el **Admin Dashboard** (`http://localhost:3002`), como profesional:
   - Deberías ver una notificación toast: "Nuevo turno reservado"
   - El calendario de turnos debería actualizarse automáticamente
   - Las estadísticas del dashboard deberían refrescarse

**Resultado esperado:**

- ✅ Notificación toast aparece
- ✅ Calendario se actualiza sin recargar
- ✅ Estadísticas se refrescan automáticamente

---

#### Escenario 2: Profesional actualiza un turno

**Pasos:**

1. En el **Admin Dashboard** (`http://localhost:3002`), como profesional:
   - Ve al calendario de turnos
   - Haz clic en un turno existente
   - Cambia el estado (confirmar, completar, etc.)

2. En el **Web Client** (`http://localhost:3001`), como cliente:
   - Abre la consola del navegador
   - Deberías ver: `Turno actualizado: { appointment: ... }`

**Resultado esperado:**

- ✅ El cliente recibe la actualización en tiempo real
- ✅ La UI se actualiza automáticamente (si está implementado)

---

#### Escenario 3: Profesional cancela un turno

**Pasos:**

1. En el **Admin Dashboard** (`http://localhost:3002`), como profesional:
   - Ve al calendario de turnos
   - Cancela un turno

2. En el **Web Client** (`http://localhost:3001`), como cliente:
   - Abre la consola del navegador
   - Deberías ver: `Turno cancelado: { appointment: ... }`

**Resultado esperado:**

- ✅ El cliente recibe la notificación de cancelación
- ✅ Notificación toast aparece (si está implementado)

---

#### Escenario 4: Pago confirmado

**Pasos:**

1. En el **Web Client** (`http://localhost:3001`), como cliente:
   - Reserva un turno y completa el pago

2. En el **Admin Dashboard** (`http://localhost:3002`), como profesional:
   - Deberías ver una notificación toast: "Pago recibido"
   - Las estadísticas del dashboard deberían refrescarse

**Resultado esperado:**

- ✅ Notificación toast aparece
- ✅ Estadísticas se actualizan automáticamente

---

### 3. **Verificación en el Backend**

#### Revisar logs del servidor:

1. Abre la terminal donde está corriendo el backend
2. Deberías ver logs como:
   ```
   [WebSocketsGateway] Cliente {id} conectado (Usuario: {userId})
   [WebSocketsGateway] Profesional {id} se unió al room business:{businessId}
   [WebSocketsGateway] Evento appointment:created emitido al room business:{businessId}
   ```

---

## 🔍 Verificación de Funcionalidad

### Checklist de Pruebas:

- [ ] **Conexión WebSocket**: Los clientes se conectan correctamente
- [ ] **Autenticación**: Solo usuarios autenticados pueden conectarse
- [ ] **Rooms**: Los profesionales se unen al room de su negocio
- [ ] **Eventos de Turnos**:
  - [ ] `appointment:created` se emite correctamente
  - [ ] `appointment:updated` se emite correctamente
  - [ ] `appointment:cancelled` se emite correctamente
- [ ] **Eventos de Pagos**:
  - [ ] `payment:confirmed` se emite correctamente
  - [ ] `payment:refunded` se emite correctamente
- [ ] **Actualización Automática**:
  - [ ] Calendario se actualiza sin recargar
  - [ ] Estadísticas se refrescan automáticamente
  - [ ] Notificaciones toast aparecen

---

## 🐛 Solución de Problemas

### Si no se conecta:

1. **Verificar que el backend esté corriendo**:

   ```bash
   netstat -ano | findstr ":3000"
   ```

2. **Verificar la URL de WebSocket**:
   - Admin Dashboard: `http://localhost:3000` (definido en `API_CONFIG.WS_URL`)
   - Web Client: `http://localhost:3000` (definido en `useSocket.ts`)

3. **Verificar autenticación**:
   - Asegúrate de estar autenticado
   - Verifica que el token JWT sea válido

4. **Revisar logs del backend**:
   - Busca errores de conexión
   - Verifica que el gateway esté inicializado

### Si no se reciben eventos:

1. **Verificar que el evento se esté emitiendo**:
   - Revisa los logs del backend
   - Verifica que `websocketsService.notify...` se esté llamando

2. **Verificar que el cliente esté en el room correcto**:
   - Revisa los logs del backend al conectar
   - Deberías ver: `Profesional {id} se unió al room business:{businessId}`

3. **Verificar listeners en el frontend**:
   - Abre la consola del navegador
   - Verifica que los eventos se estén escuchando

---

## 📝 Notas

- Los WebSockets se conectan automáticamente cuando el usuario está autenticado
- Los profesionales se unen al room de su negocio al conectarse
- Los clientes se unen a los rooms de los negocios donde tienen turnos
- Las actualizaciones son en tiempo real, sin necesidad de recargar la página
