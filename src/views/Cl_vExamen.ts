import { I_vExamen } from '../interfaces/I_vExamen.js';
import { Cl_mExamen } from '../models/Cl_mExamen.js';
import { Cl_cExamen } from '../controllers/Cl_cExamen.js';

export class Cl_vExamen implements I_vExamen {
    private controlador: Cl_cExamen;
    private examenSeleccionado: Cl_mExamen | null = null;

    private divListaPendientes = document.getElementById('lista-pendientes') as HTMLDivElement;
    private formResultados = document.getElementById('form-resultados') as HTMLFormElement;
    private divCamposDinamicos = document.getElementById('contenedor-campos-dinamicos') as HTMLDivElement;
    private btnGuardarAvance = document.querySelector('.btn-guardar') as HTMLButtonElement;

    constructor() {
        this.controlador = new Cl_cExamen();
        this.inicializarEventos();
        this.cargarColaTrabajo();
        const estilosClaros = document.createElement('style');
        estilosClaros.innerHTML = `
            body { 
                background-color: #f4f6f9 !important; 
                color: #333333 !important; 
            }
            h1, h2, h3, h4, label, div, p { 
                color: #222222 !important; 
            }
            /* Cajas de "Cola de Pacientes" y "Transcripción de Resultados" */
            div[class*="cola"], div[id*="cola"], div[class*="formulario"], section, main, .panel {
                background-color: #ffffff !important;
                color: #333333 !important;
                border: 1px solid #dddddd !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05) !important;
            }
            /* Tarjetas individuales de pacientes pendientes en la cola */
            div[class*="tarjeta"], .tarjeta-paciente, .paciente-item, div[style*="background"][style*="V-123"], div[class*="cola"] > div {
                background-color: #f8f9fa !important;
                background: #f8f9fa !important;
                color: #333333 !important;
                border: 1px solid #e0e0e0 !important;
                border-left: 5px solid #0056b3 !important;
            }
            /* Asegurar que el texto interno de la tarjeta sea visible */
            div[class*="tarjeta"] *, .tarjeta-paciente *, div[class*="cola"] > div * {
                color: #333333 !important;
            }
            /* Etiqueta de cantidad de analíticas (ej: 2 Analíticas) */
            span[class*="badge"], div[class*="analitica"], .badge {
                background-color: #e6f0fa !important;
                color: #0056b3 !important;
                border: 1px solid #b8daff !important;
            }
            /* Inputs para la transcripción de las muestras médicas */
            input[type="text"], input[type="number"], .input-resultado {
                background-color: #ffffff !important;
                color: #333333 !important;
                border: 1px solid #cccccc !important;
            }
            
            /* 🔵 CAMBIO SOLICITADO: Botón Guardar Avance en el azul del sistema */
            button[id*="guardar"], button[class*="guardar"], .btn-guardar, [style*="Guardar Avance"] {
                background-color: #0056b3 !important;
                background: #0056b3 !important;
                color: #ffffff !important;
                border: 1px solid #004085 !important;
                transition: background-color 0.2s ease !important;
            }
            /* Efecto al pasar el mouse por encima del botón azul */
            button[id*="guardar"]:hover, button[class*="guardar"]:hover, .btn-guardar:hover {
                background-color: #004085 !important;
                background: #004085 !important;
                cursor: pointer !important;
            }

            /* Mensajes de alerta cuando la cola esté vacía */
            .mensaje-vacio, p[style*="color"] {
                color: #666666 !important;
            }
        `;
        document.head.appendChild(estilosClaros);
    }

    private inicializarEventos(): void {
        this.btnGuardarAvance.addEventListener('click', async () => {
            if (!this.examenSeleccionado || !this.examenSeleccionado.id) return;
            try {
                const resultados = this.obtenerResultadosIngresados();
                await this.controlador.guardarResultados(this.examenSeleccionado.id, resultados);
                this.examenSeleccionado.resultados = resultados;
                alert("Avance de transcripción resguardado temporalmente.");
            } catch (error) {
                alert("Error de red al salvar el avance parcial.");
            }
        });

        this.formResultados.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!this.examenSeleccionado || !this.examenSeleccionado.id) return;

            try {
                const resultados = this.obtenerResultadosIngresados();
                await this.controlador.guardarResultados(this.examenSeleccionado.id, resultados);
                await this.controlador.finalizarExamen(this.examenSeleccionado.id);
                
                alert("Resultados validados. La orden pasó al archivo de impresión.");
                this.limpiarZonaEdicion();
                await this.cargarColaTrabajo();
            } catch (error) {
                alert("Error al finalizar el examen clínico.");
            }
        });
    }

    private async cargarColaTrabajo(): Promise<void> {
        try {
            const pendientes = await this.controlador.filtrarPorEstado('Pendiente');
            this.mostrarColaPendientes(pendientes);
        } catch (error) {
            this.divListaPendientes.innerHTML = '<p style="color:red;">Error cargando cola de trabajo analítica.</p>';
        }
    }

    public mostrarColaPendientes(examenes: Cl_mExamen[]): void {
        this.divListaPendientes.innerHTML = '';
        if (examenes.length === 0) {
            this.divListaPendientes.innerHTML = '<p style="color: #a0a0a5;">No existen exámenes pendientes en cola.</p>';
            return;
        }

        examenes.forEach(ex => {
            const div = document.createElement('div');
            div.className = 'tarjeta-paciente';
            div.innerHTML = `
                <div class="info-paciente">
                    <span class="nombre">${ex.pacienteNombre}</span>
                    <span class="cedula">V-${ex.pacienteCedula}</span>
                </div>
                <span class="badge-cantidad">${ex.estudiosSolicitados.length} Analíticas</span>
            `;
            div.addEventListener('click', () => {
                this.examenSeleccionado = ex;
                this.mostrarFormularioResultados(ex);
            });
            this.divListaPendientes.appendChild(div);
        });
    }

    public mostrarFormularioResultados(examen: Cl_mExamen): void {
        this.divCamposDinamicos.innerHTML = '';
        this.formResultados.style.display = 'block';

        examen.estudiosSolicitados.forEach((estudio, indice) => {
            const fila = document.createElement('div');
            fila.className = 'fila-resultado';
            fila.innerHTML = `
                <label>${indice + 1}. ${estudio.nombre}</label>
                <div class="entrada-resultado">
                    <input type="text" 
                           class="txt-resultado-valor" 
                           data-estudio-id="${estudio.id}" 
                           value="${examen.resultados[estudio.id || ''] || ''}" 
                           required 
                           placeholder="Introduzca valor obtenido">
                    <span class="valores-referencia">(Ref: ${estudio.valorReferencia})</span>
                </div>
            `;
            this.divCamposDinamicos.appendChild(fila);
        });
    }

    public obtenerResultadosIngresados(): Record<string, string> {
        const resultados: Record<string, string> = {};
        const inputs = this.divCamposDinamicos.querySelectorAll('.txt-resultado-valor');
        inputs.forEach(input => {
            const htmlInput = input as HTMLInputElement;
            const estudioId = htmlInput.getAttribute('data-estudio-id') || '';
            resultados[estudioId] = htmlInput.value;
        });
        return resultados;
    }

    public limpiarZonaEdicion(): void {
        this.examenSeleccionado = null;
        this.formResultados.style.display = 'none';
        this.divCamposDinamicos.innerHTML = '';
    }
}

document.addEventListener('DOMContentLoaded', () => new Cl_vExamen());