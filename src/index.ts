export interface Representante {
  nombre: string;
  apellido: string;
  email: string;
  cargo: string;
  empresa: string;
  rutEmpresa: string;
  telefono?: string;
  cuantasSesiones: 0 | 1 | 2;
  soloInscribiendoEquipo: boolean;
  cantidadPersonas: number;
}

export interface MiembroEquipo {
  nombre: string;
  apellido: string;
  email: string;
  cargo: string;
  telefono?: string;
  cuantasSesiones: 1 | 2;
}

export interface RegistroCompleto {
  empresa: string;
  rutEmpresa: string;
  representante: Omit<Representante, 'empresa' | 'rutEmpresa' | 'cantidadPersonas'>;
  equipo: MiembroEquipo[];
}

export interface FormData {
  representante: Representante;
  equipo: MiembroEquipo[];
}

export type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}
