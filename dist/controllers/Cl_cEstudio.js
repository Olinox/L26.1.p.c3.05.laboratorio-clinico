/**
========================
5. Laboratorio Clínico
========================
Gestión de pacientes y exámenes médicos.

* Configuración: El personal carga la lista de estudios de laboratorio.
* APP de Usuarios (Bioanalista): Visualizan el menú, seleccionan los pacientes y carga los resultados de los exámenes y una vez cargado marca como finalizado (listo para imprimir).
* APP del Personal (Administración): Toma los datos del paciente e indica los estudios de laboratorio que se realizaran y la cobranza, además puede ver en el panel los estudios finalizados para imprimir y reportar al paciente.

Diseño sugerido: El laboratorio procesa exámenes, cada uno con sus estudios, resultados y datos de pago.
 */
import { Cl_mEstudio } from '../models/Cl_mEstudio.js';
export class Cl_cEstudio {
    API_URL = 'https://6a1305d078d0434e0d5db973.mockapi.io/api/v1/estudios';
    async obtenerTodos() {
        try {
            const respuesta = await fetch(this.API_URL);
            if (!respuesta.ok)
                throw new Error();
            const datos = await respuesta.json();
            return datos.map((e) => new Cl_mEstudio(e.nombre, Number(e.precio), e.valorReferencia, e.id));
        }
        catch (error) {
            console.warn("Falla de red: Cargando contingencia académica local.");
            return [
                new Cl_mEstudio("Hematología Completa", 15.00, "4.5 - 5.9 mill/µL", "1"),
                new Cl_mEstudio("Glicemia Basal", 10.00, "70 - 100 mg/dL", "2"),
                new Cl_mEstudio("Urea en Sangre", 12.50, "15 - 45 mg/dL", "3"),
                new Cl_mEstudio("Creatinina", 14.00, "0.6 - 1.2 mg/dL", "4"),
                new Cl_mEstudio("Perfil Lipídico", 25.00, "Óptimo < 200 mg/dL", "5")
            ];
        }
    }
}
//# sourceMappingURL=Cl_cEstudio.js.map