export class Cl_mEstudio {
    _id = "";
    _nombre = "";
    _precio = 0;
    _valorReferencia = "";
    constructor(nombre, precio, valorReferencia, id) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.valorReferencia = valorReferencia;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get nombre() {
        return this._nombre;
    }
    set nombre(value) {
        this._nombre = value;
    }
    get precio() {
        return this._precio;
    }
    set precio(value) {
        this._precio = value;
    }
    get valorReferencia() {
        return this._valorReferencia;
    }
    set valorReferencia(value) {
        this._valorReferencia = value;
    }
}
//# sourceMappingURL=Cl_mEstudio.js.map