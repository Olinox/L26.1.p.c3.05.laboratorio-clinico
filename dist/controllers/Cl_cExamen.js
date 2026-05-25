import { Cl_mExamen } from '../models/Cl_mExamen.js';
import { Cl_mEstudio } from '../models/Cl_mEstudio.js';
export class Cl_cExamen {
    API_URL = 'https://6a1305d078d0434e0d5db973.mockapi.io/api/v1/examenes';
    calcularMontoTotal(estudios) {
        const acumulado = estudios.reduce((total, estudio) => total + estudio.precio, 0);
        return Math.round(acumulado * 100) / 100;
    }
    async registrarExamen(nombre, cedula, estudios) {
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
        if (!respuesta.ok)
            throw new Error('Error al registrar la orden clínica.');
    }
    async obtenerTodosLosExamenes() {
        const respuesta = await fetch(this.API_URL);
        if (!respuesta.ok)
            throw new Error('Error al consultar base de datos.');
        const datos = await respuesta.json();
        return datos.map((ex) => {
            const estudiosInstanciados = ex.estudiosSolicitados.map((est) => new Cl_mEstudio(est.nombre, Number(est.precio), est.valorReferencia, est.id));
            const instExamen = new Cl_mExamen(ex.pacienteNombre, ex.pacienteCedula, estudiosInstanciados, Number(ex.totalCobrado), ex.id);
            instExamen.resultados = ex.resultados || {};
            instExamen.estado = ex.estado;
            return instExamen;
        });
    }
    async filtrarPorEstado(estado) {
        const listaCompleta = await this.obtenerTodosLosExamenes();
        return listaCompleta.filter(ex => ex.estado === estado);
    }
    async guardarResultados(idExamen, resultados) {
        const respuesta = await fetch(`${this.API_URL}/${idExamen}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resultados })
        });
        if (!respuesta.ok)
            throw new Error('Error al guardar el avance.');
    }
    async finalizarExamen(idExamen) {
        const respuesta = await fetch(`${this.API_URL}/${idExamen}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'Finalizado' })
        });
        if (!respuesta.ok)
            throw new Error('Error al finalizar el análisis.');
    }
}
//# sourceMappingURL=Cl_cExamen.js.map