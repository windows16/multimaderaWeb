
import type { Herramienta } from '@/types/Materiales/Herramientas';
import apiMultimadera from './api-client';

// Herramientas

export async function getAllHerramientas(): Promise<Herramienta[]> {
    const { data } = await apiMultimadera.get("/herramientas");
    return data;
}

export async function insertHerramienta({idHerramienta, ...clienteData}: Herramienta) {
    const { data } = await apiMultimadera.post("/herramientas", clienteData);
    return data;
}

export async function updateHerramienta({idHerramienta, ...clienteData}: Herramienta) {
    const { data } = await apiMultimadera.patch(`/herramientas/${idHerramienta}`, clienteData);
    return data;
}

export async function deleteHerramienta(idHerramienta: number): Promise<boolean> {
   const { data } = await apiMultimadera.delete(`/herramientas/${idHerramienta}`);
   return data;
}