import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { RepresentanteFormData } from '@/types/validations';

interface RepresentanteFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
}

const RepresentanteForm: React.FC<RepresentanteFormProps> = ({
  register,
  errors,
  watch,
}) => {
  const soloInscribiendoEquipo = watch('representante.soloInscribiendoEquipo');

  return (
    <div className="form-section">
      <h2>Datos del Representante</h2>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="nombre">Nombre *</label>
          <input
            type="text"
            id="nombre"
            {...register('representante.nombre')}
            className={errors.representante?.nombre ? 'error' : ''}
          />
          {errors.representante?.nombre && (
            <span className="error-message">{errors.representante.nombre.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="apellido">Apellido *</label>
          <input
            type="text"
            id="apellido"
            {...register('representante.apellido')}
            className={errors.representante?.apellido ? 'error' : ''}
          />
          {errors.representante?.apellido && (
            <span className="error-message">{errors.representante.apellido.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            {...register('representante.email')}
            className={errors.representante?.email ? 'error' : ''}
          />
          {errors.representante?.email && (
            <span className="error-message">{errors.representante.email.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="cargo">Cargo *</label>
          <input
            type="text"
            id="cargo"
            {...register('representante.cargo')}
            className={errors.representante?.cargo ? 'error' : ''}
          />
          {errors.representante?.cargo && (
            <span className="error-message">{errors.representante.cargo.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="empresa">Empresa *</label>
          <input
            type="text"
            id="empresa"
            {...register('representante.empresa')}
            className={errors.representante?.empresa ? 'error' : ''}
          />
          {errors.representante?.empresa && (
            <span className="error-message">{errors.representante.empresa.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="rutEmpresa">RUT Empresa *</label>
          <input
            type="text"
            id="rutEmpresa"
            placeholder="12345678-9"
            {...register('representante.rutEmpresa')}
            className={errors.representante?.rutEmpresa ? 'error' : ''}
          />
          {errors.representante?.rutEmpresa && (
            <span className="error-message">{errors.representante.rutEmpresa.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            {...register('representante.telefono')}
            className={errors.representante?.telefono ? 'error' : ''}
          />
          {errors.representante?.telefono && (
            <span className="error-message">{errors.representante.telefono.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="cuantasSesiones">Número de Sesiones *</label>
          <select
            id="cuantasSesiones"
            {...register('representante.cuantasSesiones', { valueAsNumber: true })}
            className={errors.representante?.cuantasSesiones ? 'error' : ''}
          >
            <option value="">Seleccionar...</option>
            <option value={0}>No asistiré a ninguna sesión</option>
            <option value={1}>1 Sesión</option>
            <option value={2}>2 Sesiones</option>
          </select>
          {errors.representante?.cuantasSesiones && (
            <span className="error-message">{errors.representante.cuantasSesiones.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="cantidadPersonas">Cantidad de Personas *</label>
          <input
            type="number"
            id="cantidadPersonas"
            min="1"
            max="50"
            {...register('representante.cantidadPersonas', { valueAsNumber: true })}
            className={errors.representante?.cantidadPersonas ? 'error' : ''}
          />
          {errors.representante?.cantidadPersonas && (
            <span className="error-message">{errors.representante.cantidadPersonas.message}</span>
          )}
        </div>
      </div>

      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            {...register('representante.soloInscribiendoEquipo')}
          />
          <span className="checkmark"></span>
          Estoy inscribiendo a un equipo (no solo a mí mismo)
        </label>
      </div>

      {soloInscribiendoEquipo && (
        <div className="info-message">
          <p>💡 Como estás inscribiendo a un equipo, aparecerán formularios adicionales para cada miembro.</p>
        </div>
      )}
    </div>
  );
};

export default RepresentanteForm;
