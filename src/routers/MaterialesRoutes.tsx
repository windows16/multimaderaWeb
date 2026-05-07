import HerramientasMaestro from "@/features/materiales/HerramientasMaestro"
import { Route } from "react-router-dom"

export const MaterialesRoutes = (
  <>
    <Route path="/herramientas" element={<HerramientasMaestro />} />
  </>
)