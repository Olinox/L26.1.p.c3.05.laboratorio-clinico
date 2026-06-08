import { Cl_mExamen } from '../models/Cl_mExamen.js';
import { Cl_mEstudio } from '../models/Cl_mEstudio.js';

export interface IExamen {
    id?: string;
    nombre: string;
    cedula: string;
    celular: string;
    estudiosSolicitados: Cl_mEstudio[];
    resultados: Record<string, string>;
    totalCobrado: number;
    estado: 'Pendiente' | 'Finalizado';
}

export interface I_vExamen {
    mostrarColaPendientes(examenes: Cl_mExamen[]): void;
    mostrarFormularioResultados(examen: Cl_mExamen): void;
    obtenerResultadosIngresados(): Record<string, string>;
    limpiarZonaEdicion(): void;
}