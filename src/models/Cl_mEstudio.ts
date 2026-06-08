import { IEstudio } from '../interfaces/I_vLaboratorio.js';

export class Cl_mEstudio implements IEstudio {
    private _id?: string = "";
    private _nombre: string = "";
    private _precio: number = 0;
    private _valorReferencia: string = "";

    constructor(nombre: string, precio: number, valorReferencia: string, id?: string) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.valorReferencia = valorReferencia;
    }

    public get id(): string | undefined { 
        return this._id; 
    }
    public set id(value: string | undefined) { 
        this._id = value; 
    }

    public get nombre(): string { 
        return this._nombre; 
    }
    public set nombre(value: string) { 
        this._nombre = value; 
    }

    public get precio(): number { 
        return this._precio; 
    }
    public set precio(value: number) { 
        this._precio = value; 
    }

    public get valorReferencia(): string { 
        return this._valorReferencia; 
    }
    public set valorReferencia(value: string) { 
        this._valorReferencia = value; 
    }
}