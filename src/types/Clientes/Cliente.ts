

export interface Cliente {
    nombre: string;
    telefono: string;
    idTipoCliente: number | null;
    numeroDeCliente: number | null;
    tipoCliente?: string | null;
}

export type FormCliente = Omit<Cliente, "tipoCliente">;

