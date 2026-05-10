import type { Cliente } from '@/types/Clientes/Cliente';
import apiMultimadera from './api-client';
import type { TipoCliente } from '@/types/Clientes/TipoCliente';

// Clientes

export async function getAllClientes(): Promise<Cliente[]> {
    const { data } = await apiMultimadera.get("/clientes");
    return data;
}

export async function insertCliente({numeroDeCliente, tipoCliente, ...Data}: Cliente) {
    const { data } = await apiMultimadera.post("/clientes", Data);
    return data;
}

export async function updateCliente({numeroDeCliente,tipoCliente, ...Data}: Cliente) {
    const { data } = await apiMultimadera.patch(`/clientes/${numeroDeCliente}`, Data);
    return data;
}

export async function deleteCliente(numeroDeCliente: number): Promise<boolean> {
   const { data } = await apiMultimadera.delete(`/clientes/${numeroDeCliente}`);
   return data;
}


export async function getAllTiposCliente(): Promise<TipoCliente[]> {
    const { data } = await apiMultimadera.get("/tipos-cliente");
    return data;
}

export async function insertTipoCliente({idTipoCliente, ...Data}: TipoCliente) {
    const { data } = await apiMultimadera.post("/tipos-cliente", Data);
    return data;
}

export async function updateTipoCliente({idTipoCliente, ...Data}: TipoCliente) {
    const { data } = await apiMultimadera.patch(`/tipos-cliente/${idTipoCliente}`, Data);
    return data;
}

export async function deleteTipoCliente(idTipoCliente: number): Promise<boolean> {
   const { data } = await apiMultimadera.delete(`/tipos-cliente/${idTipoCliente}`);
   return data;
}