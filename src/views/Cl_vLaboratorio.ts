import { Cl_mEstudio } from '../models/Cl_mEstudio.js';
import { Cl_mExamen } from '../models/Cl_mExamen.js';
import { Cl_cLaboratorio } from '../controllers/Cl_cLaboratorio.js';
import { Cl_cExamen } from '../controllers/Cl_cExamen.js';

export class Cl_vLaboratorio {
    private cLaboratorio: Cl_cLaboratorio;
    private cExamen: Cl_cExamen;
    private listaEstudiosCargados: Cl_mEstudio[] = [];

    private formOrden = document.getElementById('form-orden') as HTMLFormElement;
    private txtNombre = document.getElementById('txt-nombre') as HTMLInputElement;
    private txtCedula = document.getElementById('txt-cedula') as HTMLInputElement;
    private txtCelular = document.getElementById('txt-celular') as HTMLInputElement;
    private divChecklist = document.getElementById('contenedor-estudios-checklist') as HTMLDivElement;
    private lblTotal = document.getElementById('lbl-total') as HTMLSpanElement;
    private divListaFinalizados = document.getElementById('lista-finalizados') as HTMLDivElement;

    private modalEstudio = document.getElementById('modal-nuevo-estudio') as HTMLDivElement;
    private btnAbrirModalEstudio = document.getElementById('btn-abrir-modal-estudio') as HTMLButtonElement;
    private btnCerrarModalEstudio = document.getElementById('btn-cerrar-modal-estudio') as HTMLSpanElement;
    private btnCancelarEstudio = document.getElementById('btn-cancelar-estudio') as HTMLButtonElement;
    private formNuevoEstudio = document.getElementById('form-nuevo-estudio') as HTMLFormElement;
    private txtNuevoEstudioNombre = document.getElementById('txt-nuevo-estudio-nombre') as HTMLInputElement;
    private txtNuevoEstudioPrecio = document.getElementById('txt-nuevo-estudio-precio') as HTMLInputElement;
    private txtNuevoEstudioRef = document.getElementById('txt-nuevo-estudio-ref') as HTMLInputElement;

    constructor() {
        this.cLaboratorio = new Cl_cLaboratorio();
        this.cExamen = new Cl_cExamen();
        this.inicializar();
        this.inicializarEventosModalEstudio();
        this.inyectarEstilosClaros();
    }

    private async inicializar(): Promise<void> {
        this.formOrden.addEventListener('submit', async (e) => {
            e.preventDefault();
            const estudiosSeleccionados: Cl_mEstudio[] = [];
            const checkboxes = this.divChecklist.querySelectorAll('input[type="checkbox"]:checked');
            
            checkboxes.forEach(cb => {
                const id = cb.getAttribute('data-id');
                const estudio = this.listaEstudiosCargados.find(est => est.id === id);
                if (estudio) estudiosSeleccionados.push(estudio);
            });

            if (estudiosSeleccionados.length === 0) {
                alert('Debe seleccionar al menos un estudio médico.');
                return;
            }

            await this.cExamen.registrarExamen(
                this.txtNombre.value, 
                this.txtCedula.value, 
                this.txtCelular.value, 
                estudiosSeleccionados
            );
            
            alert('Orden de cobro procesada con éxito y enviada al Bioanalista.');
            this.formOrden.reset();
            this.lblTotal.innerText = '0.00';
            this.cargarOrdenesFinalizadas();
        });

        await this.cargarCatalogoEstudios();
        await this.cargarOrdenesFinalizadas();
    }

    private inicializarEventosModalEstudio(): void {
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
            } catch (error) {
                alert('Ocurrió un inconveniente al guardar el estudio.');
                console.error(error);
            }
        });
    }

    public async cargarCatalogoEstudios(): Promise<void> {
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

    public async cargarOrdenesFinalizadas(): Promise<void> {
        const finalizados = await this.cExamen.filtrarPorEstado('Finalizado');
        this.divListaFinalizados.innerHTML = '';
        
        if (finalizados.length === 0) {
            this.divListaFinalizados.innerHTML = '<p style="color: var(--texto-secundario);">No hay reportes listos para entrega.</p>';
            return;
        }

        finalizados.forEach(ex => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-finalizado';

            // Mapeamos los nombres de los estudios solicitados
            const nombresEstudios = ex.estudiosSolicitados.map(est => est.nombre).join(', ');

            // ESTRUCTURA COMPACTA HORIZONTAL - SIN DIVS CONTENEDORES EXTRAS QUE ESTIREN EL BOTÓN
            tarjeta.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 25px; width: 100%; box-sizing: border-box;">
                    
                    <div style="display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0;">
                        <strong style="font-size: 16px;">${ex.nombre}</strong>
                        <span style="font-size: 13px; color: var(--texto-secundario);">
                            Cédula: V-${ex.cedula} | Celular: ${ex.celular || 'N/A'}
                        </span>
                        <span style="font-size: 13px; color: var(--texto-secundario);">
                            <strong>Estudios:</strong> ${nombresEstudios}
                        </span>
                    </div>
                    
                    <button class="btn-whatsapp-send" style=" background-color: #25d366; color: #ffffff; border: none; padding: 8px 14px; border-radius: 6px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-size: 13px; white-space: nowrap;
                        flex-shrink: 0; width: max-content; /* Fuerza al botón a medir exactamente lo que mide la frase */ ">
                        🟢 Enviar por WhatsApp
                    </button>

                </div>
            `;

            const btnWhatsApp = tarjeta.querySelector('.btn-whatsapp-send') as HTMLButtonElement;
            btnWhatsApp.addEventListener('click', () => {
                if (!ex.celular) {
                    alert('Este paciente no tiene registrado un número celular.');
                    return;
                }
                
                // Lógica de envío optimizada para producción (Vercel)
                const mensaje = `*🔬 LABORATORIO CLÍNICO - REPORTE DE RESULTADOS*\n--------------------------------------------------\n*Paciente:* ${ex.nombre}\n*Cédula:* V-${ex.cedula}\n*Orden Nº:* #${ex.id}\n--------------------------------------------------\n\n*RESULTADOS DE LOS ANÁLISIS:*\n\n` + 
                    ex.estudiosSolicitados.map(estudio => {
                        const resultado = ex.resultados[estudio.id || ''] || '_Pendiente por procesar_';
                        return `▪️ *${estudio.nombre}:*\n   Resultado: *${resultado}*\n   Valores Ref: ${estudio.valorReferencia}\n\n`;
                    }).join('') + 
                    `--------------------------------------------------\n_✓ Resultados validados electrónicamente._`;

                const textoCodificado = encodeURIComponent(mensaje);
                const urlFinal = `https://wa.me/${ex.celular}?text=${textoCodificado}`;

                const enlaceTemporal = document.createElement('a');
                enlaceTemporal.href = urlFinal;
                enlaceTemporal.target = '_blank';
                enlaceTemporal.rel = 'noopener noreferrer';
                enlaceTemporal.click();
            });

            this.divListaFinalizados.appendChild(tarjeta);
        });
    }

    private enviarReporteWhatsApp(examen: Cl_mExamen): void {
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
        enlaceTemporal.rel = 'noopener noreferrer'; // Añade seguridad extra requerida en producción
        enlaceTemporal.click();
    }

    private inyectarEstilosClaros(): void {
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