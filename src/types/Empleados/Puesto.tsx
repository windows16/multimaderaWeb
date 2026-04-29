 
export interface Puesto {
    idPuesto?: number | null;
    puesto: string;
    descripcion: string;
}

export type FormPuesto = Pick<Puesto, "idPuesto" | "puesto" | "descripcion">