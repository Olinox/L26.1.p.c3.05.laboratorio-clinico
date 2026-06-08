/**
========================
5. Laboratorio Clínico
========================
Gestión de pacientes y exámenes médicos.

----- Primeros requerimientos -----
* Configuración: El personal carga la lista de estudios de laboratorio.
* APP de Usuarios (Bioanalista): Visualizan el menú, seleccionan los pacientes y carga los resultados de los exámenes y una vez cargado marca como finalizado (listo para imprimir).
* APP del Personal (Administración): Toma los datos del paciente e indica los estudios de laboratorio que se realizaran y la cobranza, además puede ver en el panel los estudios finalizados para imprimir y reportar al paciente.

----- Segundos requerimientos -----
APP Clínica
- Cargar estudios
- Registrar detalles del examen (1 examen tiene varios estudios), con nombre y WhatsApp del paciente
- Los exámenes tienen estado: preparación, pendiente, listo
- Visualizar resultados

APP Analista
- Registrar los resultados del examen (valores observados en cada estudio)
- Enviar resultados al paciente (mensaje WhatsApp programático)

Diseño sugerido: El laboratorio procesa exámenes, cada uno con sus estudios, resultados y datos de pago.
 */
import { Cl_mEstudio } from '../models/Cl_mEstudio.js';
import { Cl_mLaboratorio } from '../models/Cl_mLaboratorio.js';
import { Cl_sLaboratorio } from '../services/Cl_sLaboratorio.js';
export class Cl_cLaboratorio {
    servicio;
    constructor() {
        this.servicio = new Cl_sLaboratorio();
    }
    async obtenerTodos() {
        const datos = await this.servicio.consultarEstudios();
        const listaEstudios = datos.map((e) => new Cl_mEstudio(e.nombre, Number(e.precio), e.valorReferencia, e.id));
        const labModel = new Cl_mLaboratorio(listaEstudios);
        return labModel.estudios;
    }
    async registrarNuevoEstudio(nombre, precio, valorReferencia) {
        const payload = {
            nombre: nombre,
            precio: precio,
            valorReferencia: valorReferencia
        };
        const respuesta = await fetch('https://6a1305d078d0434e0d5db973.mockapi.io/api/v1/estudios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!respuesta.ok) {
            throw new Error('Error al registrar el nuevo estudio médico en la API.');
        }
    }
}
//# sourceMappingURL=Cl_cLaboratorio.js.map