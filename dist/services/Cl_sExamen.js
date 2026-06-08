import { Cl_sMockApi } from './Cl_sMockApi.js';
export class Cl_sExamen extends Cl_sMockApi {
    async registrar(payload) {
        await this.fetchJson('/examenes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }
    async obtenerTodos() {
        return await this.fetchJson('/examenes');
    }
    async actualizarResultados(idExamen, resultados) {
        await this.fetchJson(`/examenes/${idExamen}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resultados })
        });
    }
    async cambiarEstado(idExamen, estado) {
        await this.fetchJson(`/examenes/${idExamen}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado })
        });
    }
}
//# sourceMappingURL=Cl_sExamen.js.map