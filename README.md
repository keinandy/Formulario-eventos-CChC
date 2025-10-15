# Formulario de Registro para Eventos

Un formulario dinámico y validado construido con React + TypeScript para registrar participantes a eventos. El formulario permite registrar tanto participantes individuales como equipos completos.

## 🚀 Características

- **Formulario Dinámico**: Se adapta según si es un registro individual o de equipo
- **Validaciones Robustas**: Usando React Hook Form + Yup
- **TypeScript**: Tipado completo para mayor seguridad
- **Responsive**: Diseño adaptable a dispositivos móviles
- **Integración con Google Sheets**: Envío directo a spreadsheets vía API
- **Estados de Envío**: Feedback visual durante el proceso de envío
- **Modular**: Componentes reutilizables y bien organizados

## 📋 Funcionalidades

### Datos del Representante
- Nombre y apellido (obligatorios)
- Email con validación (obligatorio)
- Cargo y empresa (obligatorios)
- RUT de empresa con formato validado (obligatorio)
- Teléfono (opcional)
- Número de sesiones (1 o 2)
- Cantidad de personas en el equipo

### Equipo (si aplica)
- Formularios dinámicos para cada miembro adicional
- Validación independiente para cada miembro
- Mismos campos que el representante (excepto datos de empresa)

### Envío y Validaciones
- Validación en tiempo real
- Formato JSON estructurado para el backend
- Manejo de estados: cargando, éxito, error
- Mensajes informativos para el usuario

## 🛠️ Tecnologías

- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **React Hook Form** - Manejo de formularios
- **Yup** - Validaciones
- **Vite** - Build tool y dev server
- **CSS3** - Estilos con variables CSS y diseño responsive

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── RepresentanteForm.tsx   # Formulario del representante
│   └── EquipoForm.tsx          # Formulario dinámico del equipo
├── services/
│   └── api.ts                  # Servicios de API
├── types/
│   ├── index.ts                # Interfaces principales
│   └── validations.ts          # Schemas de validación
├── App.tsx                     # Componente principal
├── main.tsx                    # Punto de entrada
└── styles/
    ├── App.css                 # Estilos principales
    └── index.css               # Estilos globales
```

## 🚀 Instalación y Uso

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar el endpoint
Edita el archivo `src/services/api.ts` y cambia la constante `ENDPOINT`:

```typescript
const ENDPOINT = 'https://script.google.com/macros/s/TU_SCRIPT_ID/exec';
```

### 3. Desarrollo
```bash
npm run dev
```

### 4. Build para producción
```bash
npm run build
```

### 5. Preview del build
```bash
npm run preview
```

## 🔧 Configuración del Backend (Google Apps Script)

Para que el formulario funcione, necesitas crear un Google Apps Script que reciba los datos:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Procesar datos aquí
    // Guardar en Google Sheets
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Registro guardado exitosamente'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error al procesar el registro'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 📊 Formato de Datos Enviados

El formulario envía los datos en el siguiente formato JSON:

```json
{
  "empresa": "Ejemplo S.A.",
  "rutEmpresa": "12.345.678-9",
  "representante": {
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@ejemplo.com",
    "cargo": "Gerente",
    "telefono": "987654321",
    "cuantasSesiones": 2,
    "soloInscribiendoEquipo": true
  },
  "equipo": [
    {
      "nombre": "Ana",
      "apellido": "López",
      "email": "ana@ejemplo.com",
      "cargo": "Analista",
      "telefono": "",
      "cuantasSesiones": 1
    }
  ]
}
```

## 🎨 Personalización

### Estilos
Los estilos están organizados con variables CSS para fácil personalización:

```css
:root {
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  --success-color: #059669;
  --error-color: #dc2626;
  /* ... más variables */
}
```

### Validaciones
Puedes modificar las validaciones en `src/types/validations.ts`:

```typescript
const rutValidation = yup
  .string()
  .matches(/^[0-9]+[-|‐]{1}[0-9kK]{1}$/, 'RUT debe tener formato válido')
  .required('RUT es obligatorio');
```

## 🚀 Despliegue en Vercel

1. **Conecta tu repositorio** con Vercel
2. **Configura las variables de entorno** si es necesario
3. **Deploy automático** en cada push a main

Configuración recomendada para Vercel:
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

## 📱 Responsive Design

El formulario está optimizado para:
- **Desktop**: Layout de 2 columnas
- **Tablet**: Layout adaptable
- **Mobile**: Layout de 1 columna con controles táctiles optimizados

## 🔍 Validaciones Implementadas

- **Email**: Formato válido requerido
- **RUT**: Formato chileno (12345678-9)
- **Teléfono**: Formato numérico con símbolos permitidos
- **Números**: Validación de rangos (1-50 personas, sesiones 1-2)
- **Campos requeridos**: Validación en tiempo real

## 🆘 Solución de Problemas

### Error de CORS
Si encuentras errores de CORS, asegúrate de que tu Google Apps Script tenga la configuración correcta de permisos.

### Errores de Validación
Revisa que todos los campos obligatorios estén completados y con el formato correcto.

### Problemas de Build
Verifica que todas las dependencias estén instaladas correctamente con `npm install`.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autor

Creado para facilitar el registro de participantes en eventos empresariales.

---

¿Necesitas ayuda? Abre un issue en el repositorio o contacta al equipo de desarrollo.