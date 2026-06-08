import { Cl_sMockApi } from './Cl_sMockApi.js';

export class Cl_sExamen extends Cl_sMockApi {
    public async registrar(payload: any): Promise<void> {
        await this.fetchJson<void>('/examenes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    public async obtenerTodos(): Promise<any[]> {
        return await this.fetchJson<any[]>('/examenes');
    }

    public async actualizarResultados(idExamen: string, resultados: Record<string, string>): Promise<void> {
        await this.fetchJson<void>(`/examenes/${idExamen}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resultados })
        });
    }

    public async cambiarEstado(idExamen: string, estado: 'Pendiente' | 'Finalizado'): Promise<void> {
        await this.fetchJson<void>(`/examenes/${idExamen}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado })
        });
    }
}