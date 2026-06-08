export class Cl_sMockApi {
    protected BASE_URL = 'https://6a1305d078d0434e0d5db973.mockapi.io/api/v1';

    protected async fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const respuesta = await fetch(`${this.BASE_URL}${endpoint}`, options);
        if (!respuesta.ok) {
            throw new Error(`Falla en la comunicación con el servidor: ${respuesta.statusText}`);
        }
        return respuesta.json() as Promise<T>;
    }

    public async getTabla({ tabla }: { tabla: string }): Promise<{ ok: boolean; tabla: any[] }> {
        try {
            const respuesta = await fetch(`${this.BASE_URL}/${tabla}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (respuesta.status === 404) {
                return { ok: true, tabla: [] };
            }

            if (!respuesta.ok) {
                return { ok: false, tabla: [] };
            }

            const data = await respuesta.json();
            return { ok: true, tabla: Array.isArray(data) ? data : [data] };
        } catch (error) {
            return { ok: false, tabla: [] };
        }
    }

    public async post({ tabla, registro }: { tabla: string; registro: any }): Promise<{ ok: boolean; mensaje: string }> {
        try {
            const respuesta = await fetch(`${this.BASE_URL}/${tabla}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registro)
            });

            if (!respuesta.ok) {
                return { ok: false, mensaje: "Error al guardar el registro" };
            }
            const data = await respuesta.json();
            return { ok: true, mensaje: "Registro guardado con ID: " + data.id };
        } catch (error: any) {
            return {
                ok: false,
                mensaje: "Error al guardar el registro: " + error.message
            };
        }
    }

    public async existeId({ tabla, id }: { tabla: string; id: number }): Promise<{ ok: boolean; existe: boolean }> {
        try {
            const respuesta = await fetch(`${this.BASE_URL}/${tabla}?id=${id}`);

            if (respuesta.status === 404) {
                return { ok: true, existe: false };
            }

            if (!respuesta.ok) {
                return { ok: false, existe: false };
            }

            const data = await respuesta.json();
            return { ok: true, existe: Array.isArray(data) ? data.length > 0 : !!data };
        } catch (error) {
            return { ok: false, existe: false };
        }
    }
}