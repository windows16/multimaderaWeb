import MaterialesMaestro from "@/features/materiales/components/MaterialesMaestro"
import StockMaterialesMaestro from "@/features/materiales/components/StockMaterialesMaestro"
import { Route } from "react-router-dom"

export const MaterialesRoutes = (
  <>
    <Route path="/materiales" element={<MaterialesMaestro />} />
    <Route path="/inventario" element={<StockMaterialesMaestro />} />
  </>
)