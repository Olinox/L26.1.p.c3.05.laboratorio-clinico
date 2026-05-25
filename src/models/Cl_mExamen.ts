import { Cl_mEstudio } from './Cl_mEstudio.js';
import { IExamen } from '../interfaces/I_vExamen.js';

export class Cl_mExamen implements IExamen {
    private internoId: string = "";
    private internoNombre: string = "";
    private internoCedula: string = "";
    private internoEstudios: Cl_mEstudio[] = [];
    private internoResultados: Record<string, string> = {};
    private internoTotal: number = 0;
    private internoEstado: 'Pendiente' | 'Finalizado' = 'Pendiente';

    constructor(nombre: string, cedula: string, estudios: Cl_mEstudio[], total: number, id?: string) {
        this.id = id;
        this.pacienteNombre = nombre;
        this.pacienteCedula = cedula;
        this.estudiosSolicitados = estudios;
        this.resultados = {};
        this.totalCobrado = total;
        this.estado = 'Pendiente';
    }

    public get id(): string | undefined { 
        return this.internoId; 
    }
    public set id(value: string | undefined) { 
        this.internoId = value || ""; 
    }
    

    public get pacienteNombre(): string { 
        return this.internoNombre; 
    }
    public set pacienteNombre(value: string) { 
        this.internoNombre = value; 
    }

    public get pacienteCedula(): string { 
        return this.internoCedula; 
    }
    public set pacienteCedula(value: string) { 
        this.internoCedula = value; 
    }

    public get estudiosSolicitados(): Cl_mEstudio[] { 
        return this.internoEstudios; 
    }
    public set estudiosSolicitados(value: Cl_mEstudio[]) { 
        this.internoEstudios = value; 
    }

    public get resultados(): Record<string, string> { 
        return this.internoResultados; 
    }
    public set resultados(value: Record<string, string>) { 
        this.internoResultados = value; 
    }

    public get totalCobrado(): number { 
        return this.internoTotal; 
    }
    public set totalCobrado(value: number) { 
        this.internoTotal = value; 
    }

    public get estado(): 'Pendiente' | 'Finalizado' { 
        return this.internoEstado; 
    }
    public set estado(value: 'Pendiente' | 'Finalizado') { 
        this.internoEstado = value; 
    }
}