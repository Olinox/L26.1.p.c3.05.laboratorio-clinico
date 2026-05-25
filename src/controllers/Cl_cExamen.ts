import { Cl_mExamen } from '../models/Cl_mExamen.js';
import { Cl_mEstudio } from '../models/Cl_mEstudio.js';

export class Cl_cExamen {
    private API_URL = 'https://6a1305d078d0434e0d5db973.mockapi.io/api/v1/examenes';

    public calcularMontoTotal(estudios: Cl_mEstudio[]): number {
        const acumulado = estudios.reduce((total, estudio) => total + estudio.precio, 0);
        return Math.round(acumulado * 100) / 100;
    }

    public async registrarExamen(nombre: string, cedula: string, estudios: Cl_mEstudio[]): Promise<void> {
        const total = this.calcularMontoTotal(estudios);
        const nuevoExamen = new Cl_mExamen(nombre, cedula, estudios, total);

        const payload = {
            pacienteNombre: nuevoExamen.pacienteNombre,
            pacienteCedula: nuevoExamen.pacienteCedula,
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

        const respuesta = await fetch(this.API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!respuesta.ok) throw new Error('Error al registrar la orden clínica.');
    }

    public async obtenerTodosLosExamenes(): Promise<Cl_mExamen[]> {
        const respuesta = await fetch(this.API_URL);
        if (!respuesta.ok) throw new Error('Error al consultar base de datos.');
        const datos = await respuesta.json();
        
        return datos.map((ex: any) => {
            const estudiosInstanciados = ex.estudiosSolicitados.map((est: any) => 
                new Cl_mEstudio(est.nombre, Number(est.precio), est.valorReferencia, est.id)
            );
            const instExamen = new Cl_mExamen(ex.pacienteNombre, ex.pacienteCedula, estudiosInstanciados, Number(ex.totalCobrado), ex.id);
            instExamen.resultados = ex.resultados || {};
            instExamen.estado = ex.estado;
            return instExamen;
        });
    }

    public async filtrarPorEstado(estado: 'Pendiente' | 'Finalizado'): Promise<Cl_mExamen[]> {
        const listaCompleta = await this.obtenerTodosLosExamenes();
        return listaCompleta.filter(ex => ex.estado === estado);
    }

    public async guardarResultados(idExamen: string, resultados: Record<string, string>): Promise<void> {
        const respuesta = await fetch(`${this.API_URL}/${idExamen}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resultados })
        });
        if (!respuesta.ok) throw new Error('Error al guardar el avance.');
    }

    public async finalizarExamen(idExamen: string): Promise<void> {
        const respuesta = await fetch(`${this.API_URL}/${idExamen}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'Finalizado' })
        });
        if (!respuesta.ok) throw new Error('Error al finalizar el análisis.');
    }
}