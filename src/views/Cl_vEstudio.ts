import { I_vEstudio } from '../interfaces/I_vEstudio.js';
import { Cl_mEstudio } from '../models/Cl_mEstudio.js';
import { IExamen } from '../interfaces/I_vExamen.js';
import { Cl_cExamen } from '../controllers/Cl_cExamen.js';
import { Cl_cEstudio } from '../controllers/Cl_cEstudio.js';


export class Cl_vEstudio implements I_vEstudio {
    private cExamen: Cl_cExamen;
    private cEstudio: Cl_cEstudio;
    private listaEstudiosCargados: Cl_mEstudio[] = [];

    private formOrden = document.getElementById('form-orden') as HTMLFormElement;
    private txtNombre = document.getElementById('txt-nombre') as HTMLInputElement;
    private txtCedula = document.getElementById('txt-cedula') as HTMLInputElement;
    private divChecklist = document.getElementById('contenedor-estudios-checklist') as HTMLDivElement;
    private lblTotal = document.getElementById('lbl-total') as HTMLSpanElement;
    private divListaFinalizados = document.getElementById('lista-finalizados') as HTMLDivElement;

    constructor() {
        this.cExamen = new Cl_cExamen();
        this.cEstudio = new Cl_cEstudio();
        this.inicializar();
        const estilosClaros = document.createElement('style');
        estilosClaros.innerHTML = `
            body { 
                background-color: #f4f6f9 !important; 
                color: #333333 !important; 
            }
            h1, h2, h3, h4, label, div { 
                color: #222222 !important; 
            }
            /* Contenedores principales de los formularios y listados */
            .contenedor, fieldset, form, div[id*="contenedor"], div[class*="panel"], main, section, .card {
                background-color: #ffffff !important;
                color: #333333 !important;
                border: 1px solid #dddddd !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05) !important;
            }
            /* CORRECCIÓN: Quitamos el fondo y bordes negros de las cajas contenedoras de los exámenes */
            div[id*="finalizados"], div[class*="lista"], .tarjeta-examen, div[style*="background"] {
                background-color: #ffffff !important;
                background: #ffffff !important;
                color: #333333 !important;
                border: 1px solid #e0e0e0 !important;
            }
            /* Ajuste para inputs y texto de etiquetas */
            input[type="text"], input[type="number"], select, textarea {
                background-color: #ffffff !important;
                color: #333333 !important;
                border: 1px solid #cccccc !important;
            }
            input::placeholder {
                color: #999999 !important;
            }
            /* CORRECCIÓN RADICAL: Barra del total a cobrar con alto contraste para el profesor */
            div[id*="total"], div[class*="total"], .total-seccion, #lblTotal, [style*="TOTAL A COBRAR"] {
                background-color: #e6f0fa !important;
                background: #e6f0fa !important;
                color: #0056b3 !important;
                border: 1px solid #b8daff !important;
                font-weight: bold !important;
                padding: 12px !important;
                text-align: center !important;
            }
        `;
        document.head.appendChild(estilosClaros);        
    }

    private async inicializar(): Promise<void> {
        document.body.style.backgroundColor = "#ffffff";
        document.body.style.color = "#333333";
        this.inicializarEventosFormulario();
        await this.cargarCatalogoEnChecklist();
        await this.cargarOrdenesFinalizadas();
    }

    private inicializarEventosFormulario(): void {
        this.divChecklist.addEventListener('change', () => {
            const estudiosSeleccionados = this.obtenerEstudiosSeleccionados();
            const totalCalculado = this.cExamen.calcularMontoTotal(estudiosSeleccionados);
            this.actualizarMontoTotalUI(totalCalculado);
        });

        this.formOrden.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = this.txtNombre.value.trim();
            const cedula = this.txtCedula.value.trim();
            const estudios = this.obtenerEstudiosSeleccionados();

            if (!nombre || !cedula) {
                alert("Por favor, ingrese los datos completos del paciente.");
                return;
            }

            if (estudios.length === 0) {
                alert("Debe seleccionar al menos un estudio clínico para la orden.");
                return;
            }

            try {
                await this.cExamen.registrarExamen(nombre, cedula, estudios);
                alert(`¡Cobro Procesado Exitosamente!\nPaciente: ${nombre}\nLa orden fue enviada a la cola del Bioanalista.`);
                this.formOrden.reset();
                this.actualizarMontoTotalUI(0.00);
            } catch (error) {
                alert("Error de conexión al procesar la orden en MockAPI.");
            }
        });
    }

    private async cargarCatalogoEnChecklist(): Promise<void> {
        try {
            this.listaEstudiosCargados = await this.cEstudio.obtenerTodos();
            this.renderizarCatalogoEstudios(this.listaEstudiosCargados);
        } catch (error) {
            this.divChecklist.innerHTML = `<p style="color: #ff4d4d;">Error al cargar el catálogo de estudios.</p>`;
        }
    }

    public renderizarCatalogoEstudios(estudios: Cl_mEstudio[]): void {
        this.divChecklist.innerHTML = '';
        
        estudios.forEach(estudio => {
            const divOpcion = document.createElement('div');
            divOpcion.className = 'opcion-estudio';
            divOpcion.innerHTML = `
                <input type="checkbox" value="${estudio.id}" data-precio="${estudio.precio}"> 
                ${estudio.nombre} ($${estudio.precio.toFixed(2)})
            `;
            this.divChecklist.appendChild(divOpcion);
        });
    }

    private obtenerEstudiosSeleccionados(): Cl_mEstudio[] {
        const checkboxes = this.divChecklist.querySelectorAll('input[type="checkbox"]:checked');
        const seleccionados: Cl_mEstudio[] = [];

        checkboxes.forEach(chk => {
            const inputElement = chk as HTMLInputElement;
            const idBuscado = inputElement.value;
            const estudioMatch = this.listaEstudiosCargados.find(e => e.id === idBuscado);
            if (estudioMatch) seleccionados.push(estudioMatch);
        });

        return seleccionados;
    }

    public actualizarMontoTotalUI(monto: number): void {
        this.lblTotal.textContent = monto.toFixed(2);
    }

    private async cargarOrdenesFinalizadas(): Promise<void> {
        try {
            const finalizados = await this.cExamen.filtrarPorEstado('Finalizado');
            this.mostrarExamenesFinalizados(finalizados);
        } catch (error) {
            this.divListaFinalizados.innerHTML = '<p style="color: #ff4d4d;">Error al sincronizar los reportes listos.</p>';
        }
    }

    public mostrarExamenesFinalizados(examenes: IExamen[]): void {
        this.divListaFinalizados.innerHTML = '';
        
        if (examenes.length === 0) {
            this.divListaFinalizados.innerHTML = '<p style="color: #666666;">No hay reportes listos para entrega.</p>';
            return;
        }

        const modal = document.getElementById('modal-impresion') as HTMLDivElement;
        const modalCuerpo = document.getElementById('modal-cuerpo-reporte') as HTMLDivElement;
        const btnCerrarX = document.getElementById('btn-cerrar-modal') as HTMLSpanElement;
        const btnConfirmarImpresion = document.getElementById('btn-confirmar-impresion') as HTMLButtonElement;

        // MODO CLARO EN MODAL: Fondo gris traslúcido suave para el exterior de la ventana
        modal.style.backgroundColor = "rgba(0, 0, 0, 0.4)"; 
        
        // Estilo de la caja interna del modal (donde va el reporte)
        modalCuerpo.parentElement!.style.backgroundColor = "#ffffff";
        modalCuerpo.parentElement!.style.color = "#333333";
        modalCuerpo.parentElement!.style.border = "1px solid #cccccc";

        const cerrarModal = () => { modal.style.display = 'none'; };
        btnCerrarX.onclick = cerrarModal;
        btnConfirmarImpresion.onclick = cerrarModal;

        examenes.forEach(ex => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-examen';
            
            // MODO CLARO: Tarjeta con fondo blanco, bordes grises y texto oscuro legible
            tarjeta.innerHTML = `
                <div style="background: #ffffff; border: 1px solid #dcdcdc; padding: 12px; border-radius: 6px; margin-bottom: 10px; color: #333333; font-family: sans-serif;">
                    <strong>Paciente:</strong> ${ex.pacienteNombre} (V-${ex.pacienteCedula})<br>
                    <small style="color: #666666;">Estudios: ${ex.estudiosSolicitados.map(e => e.nombre).join(', ')}</small><br>
                    <div class="grupo-botones" style="margin-top: 10px; display: flex; gap: 8px;">
                        <button class="btn-ver-resultados" style="flex: 1; background: #f0f0f0; color: #333333; border: 1px solid #cccccc; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 13px;">👁️ Ver Resultados</button>
                        <button class="btn-imprimir-reporte" style="flex: 1; background: #0056b3; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 13px;">🖨️ Imprimir</button>
                    </div>
                </div>
            `;
            
            // BOTÓN 1: Gestión de Impresión
            tarjeta.querySelector('.btn-imprimir-reporte')?.addEventListener('click', () => {
                alert(`Gestionando orden de impresión en el navegador para el paciente: ${ex.pacienteNombre}`);
            });

            // BOTÓN 2: Ver Resultados en Ventana Modal (Diseño Limpio Hospitalario)
            tarjeta.querySelector('.btn-ver-resultados')?.addEventListener('click', () => {
                let filasEstudiosHTML = '';
                ex.estudiosSolicitados.forEach(estudio => {
                    const resultadoValor = ex.resultados[estudio.id || ''] || 'No cargado';
                    
                    filasEstudiosHTML += `
                        <tr style="border-bottom: 1px solid #e0e0e0;">
                            <td style="padding: 10px 5px; font-size: 14px; color: #333333;"><strong>${estudio.nombre}</strong></td>
                            <td style="padding: 10px 5px; color: #008f5d; font-weight: bold; font-size: 14px; text-align: center;">${resultadoValor}</td>
                            <td style="padding: 10px 5px; color: #666666; font-size: 13px; text-align: right;">${estudio.valorReferencia}</td>
                        </tr>
                    `;
                });

                // MODO CLARO: Hoja de resultados en fondo blanco impecable, simulando una orden real en papel
                modalCuerpo.innerHTML = `
                    <div style="border-bottom: 2px dashed #cccccc; padding-bottom: 10px; margin-bottom: 15px; text-align: center;">
                        <h3 style="color: #0056b3; margin: 0 0 5px 0; font-size: 18px; letter-spacing: 1px;">🔬 LABORATORIO CLÍNICO</h3>
                        <p style="margin: 0; font-size: 12px; color: #666666; font-weight: bold;">REPORTE DE RESULTADOS ANALÍTICOS</p>
                    </div>
                    
                    <div style="margin-bottom: 15px; font-size: 13px; line-height: 1.5; background: #f8f9fa; padding: 10px; border-radius: 4px; border: 1px solid #e0e0e0; color: #333333;">
                        <strong>Paciente:</strong> ${ex.pacienteNombre}<br>
                        <strong>Cédula:</strong> V-${ex.pacienteCedula}<br>
                        <strong>Nº Orden:</strong> #${ex.id} | <strong>Estatus:</strong> <span style="color: #008f5d; font-weight: bold;">✓ Validado</span>
                    </div>

                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                        <thead>
                            <tr style="border-bottom: 2px solid #b0b0b0;">
                                <th style="text-align: left; color: #444444; font-size: 12px; padding-bottom: 8px;">Estudio</th>
                                <th style="text-align: center; color: #444444; font-size: 12px; padding-bottom: 8px;">Resultado</th>
                                <th style="text-align: right; color: #444444; font-size: 12px; padding-bottom: 8px;">Valores Ref.</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filasEstudiosHTML}
                        </tbody>
                    </table>
                `;

                modal.style.display = 'block';
            });

            this.divListaFinalizados.appendChild(tarjeta);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Cl_vEstudio();
});