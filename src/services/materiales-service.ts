
import type { Material } from '@/types/Materiales/Material';
import apiMultimadera from './api-client';
import type { StockMaterial } from '@/types/Materiales/StockMaterial';

const routeMateriales = "/materiales";
const routeStock = "/stock-materiales";
// Materiales

export async function getAllMateriales(): Promise<Material[]> {
    const { data } = await apiMultimadera.get(`${routeMateriales}`);
    return data;
}

export async function insertMaterial({idMaterial, ...Data}: Material) {
    const { data } = await apiMultimadera.post(`${routeMateriales}`, Data);
    return data;
}

export async function updateMaterial({idMaterial, ...Data}: Material) {
    const { data } = await apiMultimadera.patch(`${routeMateriales}/${idMaterial}`, Data);
    return data;
}

export async function deleteMaterial(idMaterial: number): Promise<boolean> {
   const { data } = await apiMultimadera.delete(`${routeMateriales}/${idMaterial}`);
   return data;
}

export async function getAllStockMateriales(): Promise<StockMaterial[]> {
    const { data } = await apiMultimadera.get(`${routeStock}`);
    return data;
}

export async function insertStockMaterial({idStock, ...Data}: StockMaterial) {
    const { data } = await apiMultimadera.post(`${routeStock}`, Data);
    return data;
}

export async function updateStockMaterial({idStock, ...Data}: StockMaterial) {
    const { data } = await apiMultimadera.patch(`${routeStock}/${idStock}`, Data);
    return data;
}

export async function deleteStockMaterial(idStock: number): Promise<boolean> {
   const { data } = await apiMultimadera.delete(`${routeStock}/${idStock}`);
   return data;
}