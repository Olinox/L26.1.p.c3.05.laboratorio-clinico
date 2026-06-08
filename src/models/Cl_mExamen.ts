import { Cl_mEstudio } from './Cl_mEstudio.js';
import { IExamen } from '../interfaces/I_vExamen.js';

export class Cl_mExamen implements IExamen {
    private _id: string = "";
    private _nombre: string = "";
    private _cedula: string = "";
    private _celular: string = "";
    private _estudios: Cl_mEstudio[] = [];
    private _resultados: Record<string, string> = {};
    private _total: number = 0;
    private _estado: 'Pendiente' | 'Finalizado' = 'Pendiente';

    constructor(nombre: string, cedula: string, celular: string, estudios: Cl_mEstudio[], total: number, id?: string) {
        this.id = id;
        this.nombre = nombre;
        this.cedula = cedula;
        this.celular = celular;
        this.estudiosSolicitados = estudios;
        this.resultados = {};
        this.totalCobrado = total;
        this.estado = 'Pendiente';
    }

    public get id(): string | undefined { 
        return this._id; 
    }
    public set id(value: string | undefined) { 
        this._id = value || ""; 
    }

    public get nombre(): string { 
        return this._nombre; 
    }
    public set nombre(value: string) { 
        this._nombre = value; 
    }

    public get cedula(): string { 
        return this._cedula; 
    }
    public set cedula(value: string) { 
        this._cedula = value; 
    }

    public get celular(): string { 
        return this._celular; 
    }
    public set celular(value: string) { 
        this._celular = value; 
    }

    public get estudiosSolicitados(): Cl_mEstudio[] { 
        return this._estudios; 
    }
    public set estudiosSolicitados(value: Cl_mEstudio[]) { 
        this._estudios = value; 
    }

    public get resultados(): Record<string, string> { 
        return this._resultados; 
    }
    public set resultados(value: Record<string, string>) { 
        this._resultados = value; 
    }

    public get totalCobrado(): number { 
        return this._total; 
    }
    public set totalCobrado(value: number) { 
        this._total = value; 
    }

    public get estado(): 'Pendiente' | 'Finalizado' { 
        return this._estado; 
    }
    public set estado(value: 'Pendiente' | 'Finalizado') { 
        this._estado = value; 
    }
}