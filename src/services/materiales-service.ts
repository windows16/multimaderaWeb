
import type { Material } from '@/types/Materiales/Material';
import apiMultimadera from './api-client';

const route = "/materiales";
// Materiales

export async function getAllMateriales(): Promise<Material[]> {
    const { data } = await apiMultimadera.get(`${route}`);
    return data;
}

export async function insertMaterial({idMaterial, ...clienteData}: Material) {
    const { data } = await apiMultimadera.post(`${route}`, clienteData);
    return data;
}

export async function updateMaterial({idMaterial, ...clienteData}: Material) {
    const { data } = await apiMultimadera.patch(`${route}/${idMaterial}`, clienteData);
    return data;
}

export async function deleteMaterial(idMaterial: number): Promise<boolean> {
   const { data } = await apiMultimadera.delete(`${route}/${idMaterial}`);
   return data;
}