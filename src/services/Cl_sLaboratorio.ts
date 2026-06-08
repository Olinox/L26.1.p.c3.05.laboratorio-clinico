import { Cl_sMockApi } from './Cl_sMockApi.js';

export class Cl_sLaboratorio extends Cl_sMockApi {
    public async consultarEstudios(): Promise<any[]> {
        try {
            return await this.fetchJson<any[]>('/estudios');
        } catch (error) {
            console.warn("Falla de red");
            return [];
        }
    }
}