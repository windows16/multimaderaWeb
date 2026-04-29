import { Route } from "react-router-dom"
import MaestroEmpleados from "@/features/empleados/maestroEmpleados"
import MaestroPuestos from "@/features/empleados/maestroPuestos"

export const EmpleadosRoutes = (
  <>
    <Route path="/empleados"element={<MaestroEmpleados />} />
    <Route path="/empleados/puestos" element={<MaestroPuestos />} />
  </>
)