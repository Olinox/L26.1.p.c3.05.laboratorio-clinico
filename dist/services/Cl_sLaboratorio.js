import { Cl_sMockApi } from './Cl_sMockApi.js';
export class Cl_sLaboratorio extends Cl_sMockApi {
    async consultarEstudios() {
        try {
            return await this.fetchJson('/estudios');
        }
        catch (error) {
            console.warn("Falla de red");
            return [];
        }
    }
}
//# sourceMappingURL=Cl_sLaboratorio.js.map