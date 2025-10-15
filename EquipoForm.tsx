import React from 'react';
import { UseFormRegister, FieldErrors, Control, useFieldArray } from 'react-hook-form';

interface EquipoFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  control: Control<any>;
  cantidadPersonas: number;
}

const EquipoForm: React.FC<EquipoFormProps> = ({
  register,
  errors,
  control,
  cantidadPersonas,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'equipo',
  });

  // Ajustar la cantidad de miembros del equipo según cantidadPersonas
  React.useEffect(() => {
    const cantidadMiembros = cantidadPersonas - 1; // -1 porque el representante no se cuenta
    const currentMembers = fields.length;

    if (cantidadMiembros > currentMembers) {
      // Agregar nuevos miembros
      for (let i = currentMembers; i < cantidadMiembros; i++) {
        append({
          nombre: '',
          apellido: '',
          email: '',
          cargo: '',
          telefono: '',
          cuantasSesiones: 1,
        });
      }
    } else if (cantidadMiembros < currentMembers) {
      // Remover miembros excedentes
      for (let i = currentMembers - 1; i >= cantidadMiembros; i--) {
        remove(i);
      }
    }
  }, [cantidadPersonas, fields.length, append, remove]);

  if (cantidadPersonas <= 1) {
    return null;
  }

  return (
    <div className="form-section">
      <h2>Miembros del Equipo</h2>
      <p className="section-description">
        Completa los datos de los {cantidadPersonas - 1} miembros adicionales del equipo:
      </p>

      {fields.map((field, index) => (
        <div key={field.id} className="team-member-form">
          <h3>Miembro {index + 1}</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor={`miembro-${index}-nombre`}>Nombre *</label>
              <input
                type="text"
                id={`miembro-${index}-nombre`}
                {...register(`equipo.${index}.nombre`)}
                className={errors.equipo?.[index]?.nombre ? 'error' : ''}
              />
              {errors.equipo?.[index]?.nombre && (
                <span className="error-message">
                  {errors.equipo[index].nombre.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor={`miembro-${index}-apellido`}>Apellido *</label>
              <input
                type="text"
                id={`miembro-${index}-apellido`}
                {...register(`equipo.${index}.apellido`)}
                className={errors.equipo?.[index]?.apellido ? 'error' : ''}
              />
              {errors.equipo?.[index]?.apellido && (
                <span className="error-message">
                  {errors.equipo[index].apellido.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor={`miembro-${index}-email`}>Email *</label>
              <input
                type="email"
                id={`miembro-${index}-email`}
                {...register(`equipo.${index}.email`)}
                className={errors.equipo?.[index]?.email ? 'error' : ''}
              />
              {errors.equipo?.[index]?.email && (
                <span className="error-message">
                  {errors.equipo[index].email.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor={`miembro-${index}-cargo`}>Cargo *</label>
              <input
                type="text"
                id={`miembro-${index}-cargo`}
                {...register(`equipo.${index}.cargo`)}
                className={errors.equipo?.[index]?.cargo ? 'error' : ''}
              />
              {errors.equipo?.[index]?.cargo && (
                <span className="error-message">
                  {errors.equipo[index].cargo.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor={`miembro-${index}-telefono`}>Teléfono</label>
              <input
                type="tel"
                id={`miembro-${index}-telefono`}
                {...register(`equipo.${index}.telefono`)}
                className={errors.equipo?.[index]?.telefono ? 'error' : ''}
              />
              {errors.equipo?.[index]?.telefono && (
                <span className="error-message">
                  {errors.equipo[index].telefono.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor={`miembro-${index}-sesiones`}>Número de Sesiones *</label>
              <select
                id={`miembro-${index}-sesiones`}
                {...register(`equipo.${index}.cuantasSesiones`, { valueAsNumber: true })}
                className={errors.equipo?.[index]?.cuantasSesiones ? 'error' : ''}
              >
                <option value="">Seleccionar...</option>
                <option value={1}>1 Sesión</option>
                <option value={2}>2 Sesiones</option>
              </select>
              {errors.equipo?.[index]?.cuantasSesiones && (
                <span className="error-message">
                  {errors.equipo[index].cuantasSesiones.message}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EquipoForm;