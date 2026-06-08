import { Cl_mExamen } from '../models/Cl_mExamen.js';
import { Cl_mEstudio } from '../models/Cl_mEstudio.js';
import { Cl_sExamen } from '../services/Cl_sExamen.js';

export class Cl_cExamen {
    private servicio: Cl_sExamen;

    constructor() {
        this.servicio = new Cl_sExamen();
    }

    public calcularMontoTotal(estudios: Cl_mEstudio[]): number {
        const acumulado = estudios.reduce((total, estudio) => total + estudio.precio, 0);
        return Math.round(acumulado * 100) / 100;
    }

    public async registrarExamen(nombre: string, cedula: string, celular: string, estudios: Cl_mEstudio[]): Promise<void> {
        const total = this.calcularMontoTotal(estudios);
        const nuevoExamen = new Cl_mExamen(nombre, cedula, celular, estudios, total);

        const payload = {
            pacienteNombre: nuevoExamen.nombre,
            pacienteCedula: nuevoExamen.cedula,
            pacienteCelular: nuevoExamen.celular,
            estudiosSolicitados: nuevoExamen.estudiosSolicitados.map(e => ({
                id: e.id, 
                nombre: e.nombre, 
                precio: e.precio, 
                valorReferencia: e.valorReferencia
            })),
            resultados: nuevoExamen.resultados,
            totalCobrado: nuevoExamen.totalCobrado,
            estado: nuevoExamen.estado
        };

        await this.servicio.registrar(payload);
    }

    public async obtenerTodosLosExamenes(): Promise<Cl_mExamen[]> {
        const datos = await this.servicio.obtenerTodos();
        return datos.map((ex: any) => {
            const estudiosRaw = Array.isArray(ex.estudiosSolicitados) ? ex.estudiosSolicitados : [];
            const estudiosInstanciados = estudiosRaw.map((est: any) => 
                new Cl_mEstudio(est.nombre, Number(est.precio), est.valorReferencia, est.id)
            );
            
            const instExamen = new Cl_mExamen(
                ex.pacienteNombre || 'Paciente sin nombre', 
                ex.pacienteCedula || '0', 
                ex.pacienteCelular || '', 
                estudiosInstanciados, 
                Number(ex.totalCobrado) || 0, 
                ex.id
            );
            
            instExamen.resultados = ex.resultados || {};
            instExamen.estado = ex.estado || 'Pendiente';
            return instExamen;
        });
    }

    public async filtrarPorEstado(estado: 'Pendiente' | 'Finalizado'): Promise<Cl_mExamen[]> {
        const listaCompleta = await this.obtenerTodosLosExamenes();
        return listaCompleta.filter(ex => ex.estado === estado);
    }

    public async guardarResultados(idExamen: string, resultados: Record<string, string>): Promise<void> {
        await this.servicio.actualizarResultados(idExamen, resultados);
    }

    public async finalizarExamen(idExamen: string): Promise<void> {
        await this.servicio.cambiarEstado(idExamen, 'Finalizado');
    }
}