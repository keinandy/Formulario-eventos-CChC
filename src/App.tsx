import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import RepresentanteForm from '@/components/RepresentanteForm';
import EquipoForm from '@/components/EquipoForm';
import { formularioCompletoSchema } from '@/types/validations';
import { enviarRegistro, transformarDatos } from '@/services/api';
import { SubmissionStatus } from '@/types';
import './App.css';

const App: React.FC = () => {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');
  const [responseMessage, setResponseMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(formularioCompletoSchema),
    mode: 'onChange',
    defaultValues: {
      representante: {
        nombre: '',
        apellido: '',
        email: '',
        cargo: '',
        empresa: '',
        rutEmpresa: '',
        telefono: '',
        cuantasSesiones: '' as any, // Se validará que se seleccione una opción
        soloInscribiendoEquipo: false,
        cantidadPersonas: 1,
      },
      equipo: [],
    },
  });

  // Observar cambios en campos clave
  const watchedValues = watch(['representante.soloInscribiendoEquipo', 'representante.cantidadPersonas']);
  const soloInscribiendoEquipo = watchedValues[0];
  const cantidadPersonas = watchedValues[1] || 1;

  const onSubmit = async (data: any) => {
    setSubmissionStatus('loading');
    setResponseMessage('');

    try {
      // Transformar datos al formato requerido
      const datosParaEnviar = transformarDatos(data.representante, data.equipo);
      
      // Enviar al endpoint
      const response = await enviarRegistro(datosParaEnviar);

      if (response.success) {
        setSubmissionStatus('success');
        setResponseMessage('¡Registro enviado exitosamente! Los datos se han guardado en el sistema CChC y recibirás una confirmación por email.');
        
        // Opcional: Limpiar formulario después del éxito
        setTimeout(() => {
          reset();
          setSubmissionStatus('idle');
          setResponseMessage('');
        }, 8000);
      } else {
        setSubmissionStatus('error');
        setResponseMessage(response.message || 'Error al enviar el registro. Por favor, inténtalo nuevamente.');
      }
    } catch (error) {
      setSubmissionStatus('error');
      setResponseMessage('Error inesperado. Por favor, verifica tu conexión e inténtalo nuevamente.');
      console.error('Error en envío:', error);
    }
  };

  const getSubmissionMessage = () => {
    switch (submissionStatus) {
      case 'loading':
        return (
          <div className="status-message loading">
            <div className="spinner"></div>
            <span>Enviando registro...</span>
          </div>
        );
      case 'success':
        return (
          <div className="status-message success">
            <span>✅ {responseMessage}</span>
          </div>
        );
      case 'error':
        return (
          <div className="status-message error">
            <span>❌ {responseMessage}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <div className="header-logo">
            <img src="/logo-cchc-cpro.png" alt="CChC + CPro" className="logo" />
          </div>
          <h1>Registro de Participantes - Encuentro Regional CChC</h1>
          <p>Completa el formulario para registrar tu participación en el encuentro regional.</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
          <RepresentanteForm
            register={register}
            errors={errors}
            watch={watch}
          />

          {soloInscribiendoEquipo && cantidadPersonas > 1 && (
            <EquipoForm
              register={register}
              errors={errors}
              control={control}
              cantidadPersonas={cantidadPersonas}
            />
          )}

          <div className="form-actions">
            {getSubmissionMessage()}
            
            <button
              type="submit"
              disabled={!isValid || submissionStatus === 'loading'}
              className="submit-button"
            >
              {submissionStatus === 'loading' ? 'Enviando...' : 'Enviar Registro'}
            </button>

            <button
              type="button"
              onClick={() => {
                reset();
                setSubmissionStatus('idle');
                setResponseMessage('');
              }}
              className="reset-button"
              disabled={submissionStatus === 'loading'}
            >
              Limpiar Formulario
            </button>
          </div>
        </form>

        <footer className="app-footer">
          <p>¿Necesitas ayuda? Contacta a nuestro equipo de soporte.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
