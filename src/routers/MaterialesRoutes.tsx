import MaterialesMaestro from "@/features/materiales/MaterialesMaestro"
import { Route } from "react-router-dom"

export const MaterialesRoutes = (
  <>
    <Route path="/materiales" element={<MaterialesMaestro />} />
  </>
)