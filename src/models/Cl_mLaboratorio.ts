import { Cl_mEstudio } from './Cl_mEstudio.js';

export class Cl_mLaboratorio {
    private _estudios: Cl_mEstudio[] = [];

    constructor(estudios: Cl_mEstudio[] = []) {
        this._estudios = estudios;
    }

    public get estudios(): Cl_mEstudio[] {
        return this._estudios;
    }

    public set estudios(valores: Cl_mEstudio[]) {
        this._estudios = valores;
    }

    public buscarPorId(id: string): Cl_mEstudio | undefined {
        return this._estudios.find(e => e.id === id);
    }
}