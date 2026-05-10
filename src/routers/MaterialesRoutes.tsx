import MaterialesMaestro from "@/features/materiales/MaterialesMaestro"
import StockMaterialesMaestro from "@/features/materiales/StockMaterialesMaestro"
import { Route } from "react-router-dom"

export const MaterialesRoutes = (
  <>
    <Route path="/materiales" element={<MaterialesMaestro />} />
    <Route path="/inventario" element={<StockMaterialesMaestro />} />
  </>
)