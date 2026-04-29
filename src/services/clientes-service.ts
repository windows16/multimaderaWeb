import type { Cliente, FormCliente } from '@/types/Clientes/Cliente';
import apiMultimadera from './api-client';

// Clientes

export async function getAllClientes(): Promise<Cliente[]> {
    const { data } = await apiMultimadera.get("/clientes");
    return data;
}

export async function insertCliente({numeroDeCliente, tipoCliente, ...clienteData}: Cliente) {
    const { data } = await apiMultimadera.post("/clientes", clienteData);
    return data;
}

export async function updateCliente({numeroDeCliente,tipoCliente, ...clienteData}: Cliente) {
    const { data } = await apiMultimadera.patch(`/clientes/${numeroDeCliente}`, clienteData);
    return data;
}

export async function deleteCliente(numeroDeCliente: number): Promise<boolean> {
   const { data } = await apiMultimadera.delete(`/clientes/${numeroDeCliente}`);
   return data;
}