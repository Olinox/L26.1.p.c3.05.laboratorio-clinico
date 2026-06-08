import { Cl_cExamen } from '../controllers/Cl_cExamen.js';
export class Cl_vExamen {
    controlador;
    examenSeleccionado = null;
    divListaPendientes = document.getElementById('lista-pendientes');
    formResultados = document.getElementById('form-resultados');
    divCamposDinamicos = document.getElementById('contenedor-campos-dinamicos');
    btnGuardarAvance = document.querySelector('.btn-guardar');
    constructor() {
        this.controlador = new Cl_cExamen();
        this.inicializarEventos();
        this.cargarColaTrabajo();
        const estilosClaros = document.createElement('style');
        estilosClaros.innerHTML = `
            body { background-color: #f4f6f9 !important; color: #333333 !important; }
            h1, h2, h3, h4, label, div, p { color: #222222 !important; }
            div[class*="cola"], div[id*="cola"], div[class*="formulario"], section, main, .panel {
                background-color: #ffffff !important; color: #333333 !important; border: 1px solid #dddddd !important; box-shadow: 0 2px 4px rgba(0,0,0,0.05) !important;
            }
            div[class*="tarjeta"], .tarjeta-paciente, .paciente-item, div[class*="cola"] > div {
                background-color: #f8f9fa !important; background: #f8f9fa !important; color: #333333 !important; border: 1px solid #e0e0e0 !important; border-left: 5px solid #0056b3 !important;
            }
            div[class*="tarjeta"] *, .tarjeta-paciente *, div[class*="cola"] > div * { color: #333333 !important; }
            span[class*="badge"], div[class*="analitica"], .badge { background-color: #e6f0fa !important; color: #0056b3 !important; border: 1px solid #b8daff !important; }
            input[type="text"], input[type="number"], .input-resultado { background-color: #ffffff !important; color: #333333 !important; border: 1px solid #cccccc !important; }
            button[id*="guardar"], button[class*="guardar"], .btn-guardar {
                background-color: #0056b3 !important; background: #0056b3 !important; color: #ffffff !important; border: 1px solid #004085 !important;
            }
            button[id*="guardar"]:hover, button[class*="guardar"]:hover, .btn-guardar:hover { background-color: #004085 !important; background: #004085 !important; cursor: pointer !important; }
            .mensaje-vacio, p[style*="color"] { color: #666666 !important; }
        `;
        document.head.appendChild(estilosClaros);
    }
    inicializarEventos() {
        this.btnGuardarAvance.addEventListener('click', async () => {
            if (!this.examenSeleccionado || !this.examenSeleccionado.id)
                return;
            try {
                const resultados = this.obtenerResultadosIngresados();
                await this.controlador.guardarResultados(this.examenSeleccionado.id, resultados);
                this.examenSeleccionado.resultados = resultados;
                alert("Avance de transcripción resguardado temporalmente.");
            }
            catch (error) {
                alert("Error de red al salvar el avance parcial.");
            }
        });
        this.formResultados.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!this.examenSeleccionado || !this.examenSeleccionado.id)
                return;
            try {
                const resultados = this.obtenerResultadosIngresados();
                await this.controlador.guardarResultados(this.examenSeleccionado.id, resultados);
                await this.controlador.finalizarExamen(this.examenSeleccionado.id);
                alert(`¡Análisis Técnico Validado!\nLa orden #${this.examenSeleccionado.id} pasó al panel administrativo.`);
                this.limpiarZonaEdicion();
                await this.cargarColaTrabajo();
            }
            catch (error) {
                alert("Error crítico de red al validar la analítica clínica.");
            }
        });
    }
    async cargarColaTrabajo() {
        try {
            const pendientes = await this.controlador.filtrarPorEstado('Pendiente');
            this.mostrarColaPendientes(pendientes);
        }
        catch (error) {
            this.divListaPendientes.innerHTML = '<p style="color: #ff4d4d; padding: 10px;">Error al conectar con la cola de trabajo de MockAPI.</p>';
        }
    }
    mostrarColaPendientes(examenes) {
        this.divListaPendientes.innerHTML = '';
        if (examenes.length === 0) {
            this.divListaPendientes.innerHTML = '<p class="mensaje-vacio" style="padding: 15px; text-align: center;">No hay muestras pendientes en la cola.</p>';
            return;
        }
        examenes.forEach(ex => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-paciente';
            tarjeta.innerHTML = `
                <div class="info-paciente">
                    <span class="nombre">${ex.nombre}</span>
                    <span class="cedula">Cédula: V-${ex.cedula}</span>
                </div>
                <span class="badge-cantidad">${ex.estudiosSolicitados.length} Analíticas</span>
            `;
            tarjeta.addEventListener('click', () => {
                this.examenSeleccionado = ex;
                this.mostrarFormularioResultados(ex);
            });
            this.divListaPendientes.appendChild(tarjeta);
        });
    }
    mostrarFormularioResultados(examen) {
        this.divCamposDinamicos.innerHTML = `
            <div style="margin-bottom: 20px; border-bottom: 2px dashed var(--borde); padding-bottom: 12px;">
                <span style="color: var(--texto-secundario); font-size: 12px; font-weight: bold; display: block; margin-bottom: 4px;">PACIENTE SELECCIONADO</span>
                <strong style="color: var(--acento-naranja); font-size: 16px;">${examen.nombre} (V-${examen.cedula})</strong>
                <span style="display: block; font-size: 11px; color: var(--texto-secundario); margin-top: 2px;">Nº de Control Clínico: #${examen.id}</span>
            </div>
        `;
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
        this.formResultados.style.display = 'block';
    }
    obtenerResultadosIngresados() {
        const resultados = {};
        const inputs = this.divCamposDinamicos.querySelectorAll('.txt-resultado-valor');
        inputs.forEach(input => {
            const htmlInput = input;
            const estudioId = htmlInput.getAttribute('data-estudio-id') || '';
            resultados[estudioId] = htmlInput.value;
        });
        return resultados;
    }
    limpiarZonaEdicion() {
        this.examenSeleccionado = null;
        this.formResultados.style.display = 'none';
        this.divCamposDinamicos.innerHTML = '';
    }
}
document.addEventListener('DOMContentLoaded', () => new Cl_vExamen());
//# sourceMappingURL=Cl_vExamen.js.map