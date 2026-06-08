export class Cl_mExamen {
    _id = "";
    _nombre = "";
    _cedula = "";
    _celular = "";
    _estudios = [];
    _resultados = {};
    _total = 0;
    _estado = 'Pendiente';
    constructor(nombre, cedula, celular, estudios, total, id) {
        this.id = id;
        this.nombre = nombre;
        this.cedula = cedula;
        this.celular = celular;
        this.estudiosSolicitados = estudios;
        this.resultados = {};
        this.totalCobrado = total;
        this.estado = 'Pendiente';
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value || "";
    }
    get nombre() {
        return this._nombre;
    }
    set nombre(value) {
        this._nombre = value;
    }
    get cedula() {
        return this._cedula;
    }
    set cedula(value) {
        this._cedula = value;
    }
    get celular() {
        return this._celular;
    }
    set celular(value) {
        this._celular = value;
    }
    get estudiosSolicitados() {
        return this._estudios;
    }
    set estudiosSolicitados(value) {
        this._estudios = value;
    }
    get resultados() {
        return this._resultados;
    }
    set resultados(value) {
        this._resultados = value;
    }
    get totalCobrado() {
        return this._total;
    }
    set totalCobrado(value) {
        this._total = value;
    }
    get estado() {
        return this._estado;
    }
    set estado(value) {
        this._estado = value;
    }
}
//# sourceMappingURL=Cl_mExamen.js.map