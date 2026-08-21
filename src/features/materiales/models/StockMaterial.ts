



export interface StockMaterial {
    idStock: number | null;
    idMaterial: number | null;
    stock: number | null;
    material?: string | null;
}

export type StockMaterialForm = Omit<StockMaterial, "material"> 