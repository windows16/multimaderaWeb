import { Route } from "react-router-dom"
import EmpleadosMaestro from "@/features/empleados/EmpleadosMaestro"
import PuestosMaestro from "@/features/empleados/PuestosMaestro"

export const EmpleadosRoutes = (
  <>
    <Route path="/empleados/personas"element={<EmpleadosMaestro />} />
    <Route path="/empleados/puestos" element={<PuestosMaestro />} />
  </>
)