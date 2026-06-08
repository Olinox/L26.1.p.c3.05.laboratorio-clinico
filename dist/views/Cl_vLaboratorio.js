import { Cl_cLaboratorio } from '../controllers/Cl_cLaboratorio.js';
import { Cl_cExamen } from '../controllers/Cl_cExamen.js';
export class Cl_vLaboratorio {
    cLaboratorio;
    cExamen;
    listaEstudiosCargados = [];
    formOrden = document.getElementById('form-orden');
    txtNombre = document.getElementById('txt-nombre');
    txtCedula = document.getElementById('txt-cedula');
    txtCelular = document.getElementById('txt-celular');
    divChecklist = document.getElementById('contenedor-estudios-checklist');
    lblTotal = document.getElementById('lbl-total');
    divListaFinalizados = document.getElementById('lista-finalizados');
    modalEstudio = document.getElementById('modal-nuevo-estudio');
    btnAbrirModalEstudio = document.getElementById('btn-abrir-modal-estudio');
    btnCerrarModalEstudio = document.getElementById('btn-cerrar-modal-estudio');
    btnCancelarEstudio = document.getElementById('btn-cancelar-estudio');
    formNuevoEstudio = document.getElementById('form-nuevo-estudio');
    txtNuevoEstudioNombre = document.getElementById('txt-nuevo-estudio-nombre');
    txtNuevoEstudioPrecio = document.getElementById('txt-nuevo-estudio-precio');
    txtNuevoEstudioRef = document.getElementById('txt-nuevo-estudio-ref');
    constructor() {
        this.cLaboratorio = new Cl_cLaboratorio();
        this.cExamen = new Cl_cExamen();
        this.inicializar();
        this.inicializarEventosModalEstudio();
        this.inyectarEstilosClaros();
    }
    async inicializar() {
        this.formOrden.addEventListener('submit', async (e) => {
            e.preventDefault();
            const estudiosSeleccionados = [];
            const checkboxes = this.divChecklist.querySelectorAll('input[type="checkbox"]:checked');
            checkboxes.forEach(cb => {
                const id = cb.getAttribute('data-id');
                const estudio = this.listaEstudiosCargados.find(est => est.id === id);
                if (estudio)
                    estudiosSeleccionados.push(estudio);
            });
            if (estudiosSeleccionados.length === 0) {
                alert('Debe seleccionar al menos un estudio médico.');
                return;
            }
            await this.cExamen.registrarExamen(this.txtNombre.value, this.txtCedula.value, this.txtCelular.value, estudiosSeleccionados);
            alert('Orden de cobro procesada con éxito y enviada al Bioanalista.');
            this.formOrden.reset();
            this.lblTotal.innerText = '0.00';
            this.cargarOrdenesFinalizadas();
        });
        await this.cargarCatalogoEstudios();
        await this.cargarOrdenesFinalizadas();
    }
    inicializarEventosModalEstudio() {
        this.btnAbrirModalEstudio.addEventListener('click', () => {
            this.modalEstudio.style.display = 'block';
        });
        const cerrarModal = () => {
            this.modalEstudio.style.display = 'none';
            this.formNuevoEstudio.reset();
        };
        this.btnCerrarModalEstudio.addEventListener('click', cerrarModal);
        this.btnCancelarEstudio.addEventListener('click', cerrarModal);
        this.formNuevoEstudio.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const nombre = this.txtNuevoEstudioNombre.value;
                const precio = Number(this.txtNuevoEstudioPrecio.value);
                const ref = this.txtNuevoEstudioRef.value;
                await this.cLaboratorio.registrarNuevoEstudio(nombre, precio, ref);
                alert('Estudio añadido al catálogo de forma exitosa.');
                cerrarModal();
                await this.cargarCatalogoEstudios();
            }
            catch (error) {
                alert('Ocurrió un inconveniente al guardar el estudio.');
                console.error(error);
            }
        });
    }
    async cargarCatalogoEstudios() {
        this.listaEstudiosCargados = await this.cLaboratorio.obtenerTodos();
        this.divChecklist.innerHTML = '';
        this.listaEstudiosCargados.forEach(est => {
            const div = document.createElement('div');
            div.className = 'tarjeta-estudio';
            div.innerHTML = `
                <label>
                    <input type="checkbox" data-id="${est.id}" data-precio="${est.precio}">
                    <strong>${est.nombre}</strong> - $${est.precio.toFixed(2)}
                </label>
            `;
            this.divChecklist.appendChild(div);
        });
        const checkboxes = this.divChecklist.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                let total = 0;
                const checked = this.divChecklist.querySelectorAll('input[type="checkbox"]:checked');
                checked.forEach(c => total += Number(c.getAttribute('data-precio') || 0));
                this.lblTotal.innerText = (Math.round(total * 100) / 100).toFixed(2);
            });
        });
    }
    async cargarOrdenesFinalizadas() {
        const finalizados = await this.cExamen.filtrarPorEstado('Finalizado');
        this.divListaFinalizados.innerHTML = '';
        if (finalizados.length === 0) {
            this.divListaFinalizados.innerHTML = '<p style="color: var(--texto-secundario);">No hay reportes listos para entrega.</p>';
            return;
        }
        finalizados.forEach(ex => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-finalizado';
            const nombresEstudios = ex.estudiosSolicitados.map(est => est.nombre).join(', ');
            tarjeta.innerHTML = `
                <div style="display: flex !important; justify-content: space-between !important; align-items: center !important; width: 100% !important; box-sizing: border-box !important; gap: 10px !important;">
                    
                    <div style="flex: 1 !important; text-align: left !important; min-width: 0 !important;">
                        <strong style="font-size: 16px; display: block; margin-bottom: 2px;">${ex.nombre}</strong>
                        <span style="font-size: 13px; color: var(--texto-secundario); display: block; margin-bottom: 2px;">
                            Cédula: V-${ex.cedula} | Celular: ${ex.celular || 'N/A'}
                        </span>
                        <span style="font-size: 13px; color: var(--texto-secundario); display: block;">
                            <strong>Estudios:</strong> ${nombresEstudios}
                        </span>
                    </div>
                    
                    <div style="flex-shrink: 0 !important;">
                        <button class="btn-whatsapp-fijo-corto" style=" background-color: #25d366 !important; color: #ffffff !important; border: none !important; padding: 6px 8px !important; border-radius: 4px !important; font-weight: bold !important; cursor: pointer !important; display: flex !important; align-items: center !important; 
                            justify-content: center !important; gap: 4px !important; font-size: 12px !important; line-height: 1.2 !important; text-align: center !important; width: 110px !important; max-width: 110px !important; box-sizing: border-box !important;">
                            🟢 Enviar por WhatsApp
                        </button>
                    </div>

                </div>
            `;
            const btnWhatsApp = tarjeta.querySelector('.btn-whatsapp-fijo-corto');
            btnWhatsApp.addEventListener('click', () => {
                if (!ex.celular) {
                    alert('Este paciente no tiene registrado un número celular.');
                    return;
                }
                this.enviarReporteWhatsApp(ex);
            });
            this.divListaFinalizados.appendChild(tarjeta);
        });
    }
    enviarReporteWhatsApp(examen) {
        let mensaje = `*🔬 LABORATORIO CLÍNICO - REPORTE DE RESULTADOS*\n`;
        mensaje += `--------------------------------------------------\n`;
        mensaje += `*Paciente:* ${examen.nombre}\n`;
        mensaje += `*Cédula:* V-${examen.cedula}\n`;
        mensaje += `*Orden Nº:* #${examen.id}\n`;
        mensaje += `--------------------------------------------------\n\n`;
        mensaje += `*RESULTADOS DE LOS ANÁLISIS:*\n\n`;
        examen.estudiosSolicitados.forEach(estudio => {
            const resultado = examen.resultados[estudio.id || ''] || '_Pendiente por procesar_';
            mensaje += `▪️ *${estudio.nombre}:*\n`;
            mensaje += `   Resultado: *${resultado}*\n`;
            mensaje += `   Valores Ref: ${estudio.valorReferencia}\n\n`;
        });
        mensaje += `--------------------------------------------------\n`;
        mensaje += `_✓ Resultados validados electrónicamente._`;
        const textoCodificado = encodeURIComponent(mensaje);
        const urlFinal = `https://wa.me/${examen.celular}?text=${textoCodificado}`;
        const enlaceTemporal = document.createElement('a');
        enlaceTemporal.href = urlFinal;
        enlaceTemporal.target = '_blank';
        enlaceTemporal.rel = 'noopener noreferrer';
        enlaceTemporal.click();
    }
    inyectarEstilosClaros() {
        const style = document.createElement('style');
        style.innerHTML = `
            body { background-color: #f4f6f9 !important; color: #1e293b !important; }
            .tarjeta-estudio { background-color: #ffffff !important; border: 1px solid #cbd5e1 !important; color: #1e293b !important; padding: 12px; margin-bottom: 8px; border-radius: 6px; }
            .tarjeta-finalizado { background-color: #ffffff !important; border: 1px solid #cbd5e1 !important; padding: 15px; margin-bottom: 12px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
            input[type="text"], input[type="number"] { background-color: #ffffff !important; border: 1px solid #cbd5e1 !important; color: #1e293b !important; padding: 8px; border-radius: 4px; width: 100%; box-sizing: border-box; }
            input::placeholder { color: #94a3b8 !important; }
        `;
        document.head.appendChild(style);
    }
}
document.addEventListener('DOMContentLoaded', () => new Cl_vLaboratorio());
//# sourceMappingURL=Cl_vLaboratorio.js.map