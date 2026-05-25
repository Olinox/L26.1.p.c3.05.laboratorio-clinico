export class Cl_mExamen {
    internoId = "";
    internoNombre = "";
    internoCedula = "";
    internoEstudios = [];
    internoResultados = {};
    internoTotal = 0;
    internoEstado = 'Pendiente';
    constructor(nombre, cedula, estudios, total, id) {
        this.id = id;
        this.pacienteNombre = nombre;
        this.pacienteCedula = cedula;
        this.estudiosSolicitados = estudios;
        this.resultados = {};
        this.totalCobrado = total;
        this.estado = 'Pendiente';
    }
    get id() {
        return this.internoId;
    }
    set id(value) {
        this.internoId = value || "";
    }
    get pacienteNombre() {
        return this.internoNombre;
    }
    set pacienteNombre(value) {
        this.internoNombre = value;
    }
    get pacienteCedula() {
        return this.internoCedula;
    }
    set pacienteCedula(value) {
        this.internoCedula = value;
    }
    get estudiosSolicitados() {
        return this.internoEstudios;
    }
    set estudiosSolicitados(value) {
        this.internoEstudios = value;
    }
    get resultados() {
        return this.internoResultados;
    }
    set resultados(value) {
        this.internoResultados = value;
    }
    get totalCobrado() {
        return this.internoTotal;
    }
    set totalCobrado(value) {
        this.internoTotal = value;
    }
    get estado() {
        return this.internoEstado;
    }
    set estado(value) {
        this.internoEstado = value;
    }
}
//# sourceMappingURL=Cl_mExamen.js.map