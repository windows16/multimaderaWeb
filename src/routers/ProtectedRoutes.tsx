
import { Route } from "react-router-dom"
import { ProtectedLayout } from "../components/common/ProtectedLayout"
import { EmpleadosRoutes } from "./EmpleadosRoutes"
import { UsuariosRoutes } from "./UsuariosRoutes"
import { ClientesRoutes } from "./ClientesRoutes"
import { PedidosRoutes } from "./PedidosRoutes"
import { ReporteriaRoutes } from "./ReporteriaRoutes"
import Session from "@/pages/Session"
import { MaterialesRoutes } from "./MaterialesRoutes"
import ReporteMaestro from "@/features/reporteria/ReporteMaestro"


export const ProtectedRoutes = (
  <Route element={<ProtectedLayout />}>
    <Route path="/" element={<ReporteMaestro />} />
    {MaterialesRoutes}
    {PedidosRoutes}
    {ClientesRoutes}
    {EmpleadosRoutes}
    {ReporteriaRoutes}
    {UsuariosRoutes}
    <Route path="/sesion" element={<Session />} />
  </Route>
)