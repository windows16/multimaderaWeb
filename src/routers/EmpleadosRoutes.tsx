import { Route } from "react-router-dom"
import EmpleadosMaestro from "@/features/empleados/components/EmpleadosMaestro"
import PuestosMaestro from "@/features/empleados/components/PuestosMaestro"
import HistoricoLaboralMaestro from "@/features/empleados/components/HistoricoLaboralMaestro"

export const EmpleadosRoutes = (
  <>
    <Route path="/empleados/personas"element={<EmpleadosMaestro />} />
    <Route path="/empleados/puestos" element={<PuestosMaestro />} />
    <Route path="/empleados/historial" element={<HistoricoLaboralMaestro />} />
  </>
)