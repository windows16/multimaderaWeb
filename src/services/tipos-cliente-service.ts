
import type { TipoCliente } from '@/types/Clientes/TipoCliente';
import apiMultimadera from './api-client';

export async function getAllTiposCliente(): Promise<TipoCliente[]> {
    const { data } = await apiMultimadera.get("/tipos-cliente");
    return data;
}

export async function insertTipoCliente({idTipoCliente, ...tipoClienteData}: TipoCliente) {
    const { data } = await apiMultimadera.post("/tipos-cliente", tipoClienteData);
    return data;
}

export async function updateTipoCliente({idTipoCliente, ...tipoClienteData}: TipoCliente) {
    const { data } = await apiMultimadera.patch(`/tipos-cliente/${idTipoCliente}`, tipoClienteData);
    return data;
}

export async function deleteTipoCliente(idTipoCliente: number): Promise<boolean> {
   const { data } = await apiMultimadera.delete(`/tipos-cliente/${idTipoCliente}`);
   return data;
}