import { Cl_mEstudio } from '../models/Cl_mEstudio.js';
import { IExamen } from './I_vExamen.js';

export interface IEstudio {
  id?: string;
  nombre: string;
  precio: number;
  valorReferencia: string;
}

export interface I_vLaboratorio {
  renderizarCatalogoEstudios(estudios: Cl_mEstudio[]): void;
  actualizarMontoTotalUI(monto: number): void;
  mostrarExamenesFinalizados(examenes: IExamen[]): void;
}