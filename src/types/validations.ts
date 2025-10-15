import * as yup from 'yup';

// Validación para emails
const emailValidation = yup
  .string()
  .email('Por favor ingrese un email válido')
  .required('El email es obligatorio');

// Validación para campos de texto obligatorios
const requiredString = (fieldName: string) =>
  yup.string().required(`Por favor complete el campo ${fieldName}`);

// Validación para teléfono (opcional pero si se llena debe tener formato válido)
const phoneValidation = yup
  .string()
  .matches(/^[+]?[\d\s\-\(\)]+$/, 'Por favor ingrese un número de teléfono válido')
  .optional();

// Validación para RUT empresarial
const rutValidation = yup
  .string()
  .matches(
    /^[0-9]+[-|‐]{1}[0-9kK]{1}$/,
    'El RUT debe tener el formato correcto (ejemplo: 12345678-9)'
  )
  .required('El RUT de la empresa es obligatorio');

// Validación para número de sesiones (representante puede elegir 0, 1 o 2)
const sesionesRepresentanteValidation = yup
  .number()
  .oneOf([0, 1, 2], 'Por favor seleccione una opción válida')
  .required('Debe seleccionar el número de sesiones');

// Validación para número de sesiones de miembros del equipo (solo 1 o 2)
const sesionesEquipoValidation = yup
  .number()
  .oneOf([1, 2], 'Los miembros del equipo deben elegir 1 o 2 sesiones')
  .required('Número de sesiones es obligatorio');

// Validación para cantidad de personas
const cantidadPersonasValidation = yup
  .number()
  .min(1, 'Debe incluir al menos 1 persona')
  .max(50, 'El máximo permitido es 50 personas por registro')
  .integer('Por favor ingrese un número entero')
  .required('La cantidad de personas es obligatoria');

// Schema para el representante
export const representanteSchema = yup.object({
  nombre: requiredString('Nombre'),
  apellido: requiredString('Apellido'),
  email: emailValidation,
  cargo: requiredString('Cargo'),
  empresa: requiredString('Empresa'),
  rutEmpresa: rutValidation,
  telefono: phoneValidation,
  cuantasSesiones: sesionesRepresentanteValidation,
  soloInscribiendoEquipo: yup.boolean().required(),
  cantidadPersonas: cantidadPersonasValidation,
});

// Schema para miembros del equipo
export const miembroEquipoSchema = yup.object({
  nombre: requiredString('Nombre'),
  apellido: requiredString('Apellido'),
  email: emailValidation,
  cargo: requiredString('Cargo'),
  telefono: phoneValidation,
  cuantasSesiones: sesionesEquipoValidation,
});

// Schema completo del formulario
export const formularioCompletoSchema = yup.object({
  representante: representanteSchema,
  equipo: yup.array().of(miembroEquipoSchema),
});

export type RepresentanteFormData = yup.InferType<typeof representanteSchema>;
export type MiembroEquipoFormData = yup.InferType<typeof miembroEquipoSchema>;
export type FormularioCompletoData = yup.InferType<typeof formularioCompletoSchema>;
