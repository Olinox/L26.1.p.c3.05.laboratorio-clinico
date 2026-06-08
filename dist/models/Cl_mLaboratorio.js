export class Cl_mLaboratorio {
    _estudios = [];
    constructor(estudios = []) {
        this._estudios = estudios;
    }
    get estudios() {
        return this._estudios;
    }
    set estudios(valores) {
        this._estudios = valores;
    }
    buscarPorId(id) {
        return this._estudios.find(e => e.id === id);
    }
}
//# sourceMappingURL=Cl_mLaboratorio.js.map