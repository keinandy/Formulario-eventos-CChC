# Formulario de Registro - Guía de Configuración

## 📝 Configuración del Endpoint de Google Apps Script

Para que el formulario funcione correctamente, necesitas crear un Google Apps Script que reciba y procese los datos.

### 1. Crear un nuevo Google Apps Script

1. Ve a [script.google.com](https://script.google.com)
2. Crea un nuevo proyecto
3. Reemplaza el código predeterminado con:

```javascript
/**
 * Maneja las solicitudes POST del formulario de registro
 */
function doPost(e) {
  try {
    // Parse de los datos JSON recibidos
    const data = JSON.parse(e.postData.contents);
    
    // Validar que los datos existan
    if (!data || !data.empresa || !data.representante) {
      throw new Error('Datos incompletos');
    }
    
    // Obtener o crear la hoja de cálculo
    const spreadsheet = getOrCreateSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    
    // Procesar y guardar los datos
    saveRegistrationData(sheet, data);
    
    // Respuesta exitosa
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Registro guardado exitosamente',
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error en doPost:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error al procesar el registro: ' + error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Obtiene o crea la hoja de cálculo para los registros
 */
function getOrCreateSpreadsheet() {
  const fileName = 'Registros_Eventos_' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy');
  
  // Buscar archivo existente
  const files = DriveApp.getFilesByName(fileName);
  
  if (files.hasNext()) {
    const file = files.next();
    return SpreadsheetApp.openById(file.getId());
  }
  
  // Crear nuevo archivo
  const spreadsheet = SpreadsheetApp.create(fileName);
  const sheet = spreadsheet.getActiveSheet();
  
  // Configurar encabezados
  setupHeaders(sheet);
  
  return spreadsheet;
}

/**
 * Configura los encabezados de la hoja
 */
function setupHeaders(sheet) {
  const headers = [
    'Fecha/Hora',
    'Empresa',
    'RUT Empresa',
    'Representante - Nombre',
    'Representante - Apellido',
    'Representante - Email',
    'Representante - Cargo',
    'Representante - Teléfono',
    'Representante - Sesiones',
    'Solo Inscribiendo Equipo',
    'Cantidad Total Personas',
    'Miembros del Equipo (JSON)'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Formatear encabezados
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
}

/**
 * Guarda los datos del registro en la hoja
 */
function saveRegistrationData(sheet, data) {
  const rep = data.representante;
  const equipoJson = JSON.stringify(data.equipo || []);
  
  const row = [
    new Date(),
    data.empresa,
    data.rutEmpresa,
    rep.nombre,
    rep.apellido,
    rep.email,
    rep.cargo,
    rep.telefono || '',
    rep.cuantasSesiones,
    rep.soloInscribiendoEquipo,
    (data.equipo ? data.equipo.length + 1 : 1),
    equipoJson
  ];
  
  sheet.appendRow(row);
  
  // Auto-ajustar columnas
  sheet.autoResizeColumns(1, sheet.getLastColumn());
}

/**
 * Función de prueba para verificar la configuración
 */
function testConfiguration() {
  const testData = {
    empresa: 'Test Corp',
    rutEmpresa: '12345678-9',
    representante: {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@test.com',
      cargo: 'Gerente',
      telefono: '123456789',
      cuantasSesiones: 2,
      soloInscribiendoEquipo: true
    },
    equipo: [
      {
        nombre: 'Ana',
        apellido: 'García',
        email: 'ana@test.com',
        cargo: 'Analista',
        telefono: '987654321',
        cuantasSesiones: 1
      }
    ]
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Resultado de prueba:', result.getContent());
}
```

### 2. Configurar permisos y despliegue

1. **Guardar el proyecto** con un nombre descriptivo
2. **Ejecutar la función de prueba**:
   - Ve a `Funciones` > `testConfiguration`
   - Haz clic en `Ejecutar`
   - Autoriza los permisos necesarios
3. **Desplegar como aplicación web**:
   - Ve a `Desplegar` > `Nueva implementación`
   - Tipo: `Aplicación web`
   - Ejecutar como: `Yo`
   - Acceso: `Cualquiera`
   - Copia la URL generada

### 3. Configurar el formulario

En tu archivo `src/services/api.ts`, reemplaza la constante `ENDPOINT`:

```typescript
const ENDPOINT = 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI';
```

### 4. Estructura de la hoja de cálculo resultante

La hoja tendrá las siguientes columnas:

| Fecha/Hora | Empresa | RUT Empresa | Rep. Nombre | Rep. Apellido | Rep. Email | Rep. Cargo | Rep. Teléfono | Rep. Sesiones | Solo Inscribiendo Equipo | Cantidad Total | Miembros Equipo |
|------------|---------|-------------|-------------|---------------|------------|------------|---------------|---------------|--------------------------|----------------|-----------------|
| 2024-01-15 10:30 | Ejemplo S.A. | 12.345.678-9 | Juan | Pérez | juan@ejemplo.com | Gerente | 987654321 | 2 | TRUE | 3 | [{"nombre":"Ana",...}] |

### 5. Funciones adicionales recomendadas

#### Notificaciones por email
```javascript
function sendNotificationEmail(data) {
  const subject = `Nuevo registro: ${data.empresa}`;
  const body = `
    Nueva inscripción recibida:
    
    Empresa: ${data.empresa}
    Representante: ${data.representante.nombre} ${data.representante.apellido}
    Email: ${data.representante.email}
    Cantidad de personas: ${data.equipo ? data.equipo.length + 1 : 1}
  `;
  
  // Cambiar por tu email
  GmailApp.sendEmail('admin@tudominio.com', subject, body);
}
```

#### Validación de RUT chileno
```javascript
function validateRUT(rut) {
  if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) {
    return false;
  }
  
  const parts = rut.split('-');
  const number = parseInt(parts[0]);
  const verifier = parts[1].toLowerCase();
  
  let sum = 0;
  let multiplier = 2;
  
  const numberStr = number.toString().split('').reverse();
  
  for (let digit of numberStr) {
    sum += parseInt(digit) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const remainder = sum % 11;
  const expectedVerifier = remainder === 0 ? '0' : remainder === 1 ? 'k' : (11 - remainder).toString();
  
  return verifier === expectedVerifier;
}
```

## 🔧 Solución de Problemas

### Error 403 - Forbidden
- Verifica que el script esté desplegado como "Aplicación web"
- Asegúrate de que el acceso sea "Cualquiera"

### Error CORS
- Google Apps Script maneja CORS automáticamente
- Si persiste, verifica la configuración de despliegue

### Datos no se guardan
- Revisa los logs en Google Apps Script (Ver > Logs)
- Ejecuta la función de prueba para verificar permisos
- Verifica que el JSON enviado tenga la estructura correcta

### Permisos de Google Sheets
- El script debe tener permisos para crear y editar archivos
- Autoriza los permisos cuando se solicite

## 📊 Monitoreo y Análisis

### Ver registros en tiempo real
```javascript
function getRecentRegistrations(hours = 24) {
  const spreadsheet = getOrCreateSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  const cutoffTime = new Date(Date.now() - (hours * 60 * 60 * 1000));
  
  return data.filter(row => {
    const rowDate = new Date(row[0]);
    return rowDate > cutoffTime;
  });
}
```

### Estadísticas básicas
```javascript
function getRegistrationStats() {
  const spreadsheet = getOrCreateSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  const totalRegistrations = data.length - 1; // -1 para excluir encabezados
  const totalParticipants = data.slice(1).reduce((sum, row) => sum + row[10], 0);
  const companiesCount = new Set(data.slice(1).map(row => row[1])).size;
  
  return {
    totalRegistrations,
    totalParticipants,
    companiesCount,
    lastUpdate: new Date()
  };
}
```

¡Con esta configuración tu formulario estará listo para recibir y procesar registros automáticamente!