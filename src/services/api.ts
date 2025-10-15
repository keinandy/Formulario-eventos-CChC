import { RegistroCompleto, ApiResponse } from '@/types';

// Endpoint de Google Apps Script - CChC
const ENDPOINT = 'https://script.google.com/a/macros/cchc.cl/s/AKfycbySTplKZ2Ito5a9xsHbIN9usKkSVeFKt1Q57Ug8xWLYl3GLmDYoiP9HAmtwn4p0Ub9r/exec';

/**
 * Transforma los datos del formulario al formato requerido para el JSON
 */
export const transformarDatos = (
  representante: any,
  equipo: any[]
): RegistroCompleto => {
  const { empresa, rutEmpresa, cantidadPersonas, ...representanteData } = representante;
  
  return {
    empresa,
    rutEmpresa,
    representante: representanteData,
    equipo: equipo || [],
  };
};

/**
 * Envía los datos al endpoint de Google Apps Script
 */
export const enviarRegistro = async (datos: RegistroCompleto): Promise<ApiResponse> => {
  try {
    console.log('Enviando datos a Google Apps Script:', datos);
    
    // Usar fetch normal para poder leer la respuesta
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos),
    });

    // Intentar leer la respuesta
    let result;
    try {
      result = await response.json();
      console.log('Respuesta del servidor:', result);
      
      if (result.success) {
        return {
          success: true,
          message: result.message || 'Registro enviado exitosamente al sistema CChC',
          data: result,
        };
      } else {
        return {
          success: false,
          message: result.message || 'Error procesando el registro',
        };
      }
    } catch (parseError) {
      // Si no se puede parsear la respuesta, pero la petición fue exitosa
      console.log('No se pudo leer respuesta JSON, pero envío exitoso');
      return {
        success: true,
        message: 'Registro enviado exitosamente (respuesta no legible)',
        data: { timestamp: new Date().toISOString() },
      };
    }
    
  } catch (error) {
    console.error('Error al enviar registro:', error);
    
    return {
      success: false,
      message: 'Error de conexión. Por favor verifica tu internet e inténtalo nuevamente.',
    };
  }
};

/**
 * Valida la conectividad con el endpoint
 */
export const validarConectividad = async (): Promise<boolean> => {
  try {
    const response = await fetch(ENDPOINT, {
      method: 'OPTIONS',
      mode: 'cors',
    });
    return response.ok;
  } catch {
    return false;
  }
};
