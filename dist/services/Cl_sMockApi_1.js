export default class Cl_sMockApi {
    static apiUrl = "https://6a0a74b121e4456256960022.mockapi.io/quiz";
    static async getTabla({ tabla }) {
        try {
            const respuesta = await fetch(`${this.apiUrl}?tabla=${tabla}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (respuesta.status === 404) {
                return { ok: true, tabla: [] };
            }
            if (!respuesta.ok) {
                return { ok: false, tabla: [] };
            }
            const data = await respuesta.json();
            return { ok: true, tabla: data };
        }
        catch (error) {
            return { ok: false, tabla: [] };
        }
    }
    static async post(registro) {
        try {
            const respuesta = await fetch(this.apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registro),
            });
            if (!respuesta.ok) {
                return { ok: false, mensaje: "Error al guardar el registro" };
            }
            const data = await respuesta.json();
            return { ok: true, mensaje: "Registro guardado con ID: " + data.id };
        }
        catch (error) {
            return {
                ok: false,
                mensaje: "Error al guardar el registro: " + error.message,
            };
        }
    }
    static async existeId({ tabla, id, }) {
        try {
            const respuesta = await fetch(`${this.apiUrl}?tabla=${tabla}&cedula=${id}`);
            // ¡El truco para domar a MockAPI!
            // Si el servidor responde 404, la conexión fue exitosa, pero no hay resultados.
            if (respuesta.status === 404) {
                return { ok: true, existe: false };
            }
            // Si falla por un error real del servidor (ej. 500)
            if (!respuesta.ok) {
                return { ok: false, existe: false };
            }
            // Si responde 200 (OK), parseamos el JSON y verificamos si hay registros
            const data = await respuesta.json();
            return { ok: true, existe: data.length > 0 };
        }
        catch (error) {
            // Solo caemos aquí si hay un error real de red (sin internet, etc.)
            return { ok: false, existe: false };
        }
    }
}
//# sourceMappingURL=Cl_sMockApi_1.js.map