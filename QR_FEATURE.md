# 📱 Funcionalidad de Generación de QR para Turnos

## 🎯 Descripción

Esta funcionalidad genera automáticamente un código QR cuando se crea un turno y envía un email de confirmación al usuario con toda la información del turno y el código QR adjunto.

## 🏗️ Arquitectura

### Archivos creados/modificados:

1. **`src/services/qrService.ts`** (NUEVO)
   - Servicio para generar códigos QR
   - Funciones: `generateQRCode()`, `generateQRCodeFile()`

2. **`src/services/emailService.ts`** (MODIFICADO)
   - Actualizado el template `turnoconfirmado` con diseño HTML profesional
   - Incluye el QR embebido en el email

3. **`src/services/shiftService.ts`** (MODIFICADO)
   - Nueva función: `createShiftWithQR()`
   - Integra creación de turno + generación de QR + envío de email

4. **`src/controllers/shiftController.ts`** (MODIFICADO)
   - Actualizado `createShift()` para usar `createShiftWithQR()`

## 📦 Dependencias instaladas

```bash
npm install qrcode
npm install --save-dev @types/qrcode
```

## 🔄 Flujo de funcionamiento

```
1. Usuario solicita crear turno (POST /shifts)
   ↓
2. Validación de datos de entrada
   ↓
3. Verificación de disponibilidad de horario
   ↓
4. Creación del turno en BD
   ↓
5. Obtención de datos completos (user, service, professional)
   ↓
6. Generación del código QR con toda la info del turno
   ↓
7. Envío de email con template HTML + QR embebido
   ↓
8. Respuesta al cliente con turno, QR y estado del email
```

## 📋 Datos incluidos en el QR

El código QR contiene la siguiente información en formato JSON:

```json
{
  "idTurno": "uuid-del-turno",
  "date": "2025-11-15",
  "time": "10:30",
  "petName": "Max",
  "service": {
    "name": "Consulta Veterinaria",
    "price": 5000,
    "description": "Consulta general"
  },
  "professional": {
    "name": "Juan",
    "lastname": "Pérez",
    "specialty": "veterinario",
    "nameEstablishment": "Clínica Veterinaria San Martín"
  },
  "usuario": {
    "name": "María",
    "lastname": "González",
    "email": "maria@example.com",
    "phone": "+54 11 1234-5678"
  }
}
```

## 📧 Template del Email

El email incluye:
- ✅ Encabezado con título de confirmación
- 📅 Fecha del turno (formato largo en español)
- 🕐 Hora del turno
- 🐾 Nombre de la mascota
- 💼 Servicio contratado
- 💰 Precio del servicio
- 👨‍⚕️ Nombre del profesional
- 🏥 Nombre del establecimiento
- 📱 Código QR (imagen embebida)
- ℹ️ Instrucciones para el usuario

## 🚀 Uso del Endpoint

### Request

```http
POST /shifts
Content-Type: application/json

{
  "idUser": "uuid-del-usuario",
  "idService": "uuid-del-servicio",
  "date": "2025-11-20",
  "time": "10:30",
  "phone": "+54 11 1234-5678",
  "petname": "Max"
}
```

### Response Exitosa

```json
{
  "status": "success",
  "message": "Turno creado exitosamente. Se ha enviado un email de confirmación con el código QR.",
  "data": {
    "shift": {
      "id": "uuid-del-turno",
      "idUser": "uuid-del-usuario",
      "idService": "uuid-del-servicio",
      "date": "2025-11-20",
      "time": "10:30",
      "phone": "+54 11 1234-5678",
      "petname": "Max",
      "user": { /* datos del usuario */ },
      "service": { /* datos del servicio */ },
      "createdAt": "2025-11-15T...",
      "updatedAt": "2025-11-15T..."
    },
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "emailSent": true
  }
}
```

### Response con Error

```json
{
  "status": "error",
  "message": "El horario seleccionado no está disponible"
}
```

## ⚙️ Configuración requerida

### Variables de entorno (.env)

Asegúrate de tener configuradas estas variables:

```env
GMAIL_USER=tu-email@gmail.com
GMAIL_PASSWORD=tu-contraseña-de-aplicacion
```

**Nota:** Para Gmail, necesitas generar una "Contraseña de aplicación" desde tu cuenta de Google:
1. Ir a https://myaccount.google.com/security
2. Activar verificación en 2 pasos
3. Generar contraseña de aplicación
4. Usar esa contraseña en `GMAIL_PASSWORD`

## 🎨 Personalización del QR

Puedes personalizar el QR editando `src/services/qrService.ts`:

```typescript
const qrCodeImage = await QRCode.toDataURL(qrDataString, {
  errorCorrectionLevel: 'M', // L, M, Q, H
  type: 'image/png',
  margin: 1,
  width: 300,
  color: {
    dark: '#000000',  // Color del QR
    light: '#FFFFFF'  // Color del fondo
  }
});
```

## 🎨 Personalización del Email

Puedes personalizar el template HTML en `src/services/emailService.ts`:

```typescript
export const emailTemplates = {
  turnoconfirmado: (data: TurnoConfirmadoData) => ({
    subject: "✅ Confirmación de turno",
    html: `
      <!-- Tu HTML personalizado aquí -->
    `
  })
}
```

## 🔍 Escaneo del QR

Para escanear y leer los datos del QR, puedes usar:

1. **Aplicación móvil nativa** - La mayoría de smartphones modernos pueden escanear QR con la cámara
2. **Lector de QR web** - Websites como https://webqr.com/
3. **Implementar en tu app** - Usar librerías como:
   - `react-qr-scanner` (React)
   - `html5-qrcode` (Vanilla JS)
   - `zxing` (Android/iOS nativo)

### Ejemplo de lectura de datos:

```javascript
// Después de escanear el QR, obtienes un string JSON
const qrData = JSON.parse(scannedText);

console.log('ID del turno:', qrData.idTurno);
console.log('Fecha:', qrData.date);
console.log('Hora:', qrData.time);
console.log('Mascota:', qrData.petName);
// etc...
```

## 🐛 Manejo de errores

La funcionalidad incluye manejo de errores en múltiples niveles:

1. **Validación de datos** - Campos requeridos, formatos
2. **Disponibilidad** - Verifica que el horario esté disponible
3. **Generación de QR** - Captura errores de la librería QRCode
4. **Envío de email** - Captura errores de nodemailer
5. **Logging** - Registra todos los eventos y errores

## 📊 Logs

Todos los eventos importantes se registran con bunyan:

```
✅ Turno creado exitosamente en service con ID: xxx
✅ QR generado para el turno xxx
✅ Email de confirmación enviado a usuario@example.com
⚠️  No se pudo enviar el email de confirmación a usuario@example.com
❌ Error al crear turno con QR: <error>
```

## 🧪 Testing

### Prueba manual:

1. Crear un turno con Postman/Thunder Client
2. Verificar que el email llegue correctamente
3. Escanear el QR con tu celular
4. Verificar que los datos sean correctos

### Ejemplo de request:

```bash
curl -X POST http://localhost:3000/shifts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token>" \
  -d '{
    "idUser": "uuid-del-usuario",
    "idService": "uuid-del-servicio",
    "date": "2025-11-20",
    "time": "10:30",
    "phone": "+54 11 1234-5678",
    "petname": "Max"
  }'
```

## 🔐 Seguridad

- ✅ El QR contiene toda la información necesaria pero no datos sensibles (contraseñas)
- ✅ El email solo se envía al usuario propietario del turno
- ✅ Validación de todos los datos de entrada
- ✅ Logging de todas las acciones para auditoría

## 📝 Notas adicionales

- El QR se genera en formato **Data URL** (base64), no se guarda como archivo
- Si quieres guardar el QR como archivo, usa `generateQRCodeFile()`
- El nivel de corrección de errores del QR es 'M' (Medium) - puede recuperarse hasta un 15% de daño
- El email usa HTML con estilos inline para máxima compatibilidad con clientes de correo

## 🚧 Próximas mejoras sugeridas

- [ ] Agregar opción para reenviar email con QR
- [ ] Implementar cancelación de turno escaneando QR
- [ ] Agregar QR al PDF del comprobante
- [ ] Implementar verificación del QR en el establecimiento
- [ ] Agregar estadísticas de turnos escaneados vs no escaneados

---

**Creado por:** Sistema de Gestión de Turnos  
**Fecha:** 15 de noviembre de 2025  
**Versión:** 1.0.0
