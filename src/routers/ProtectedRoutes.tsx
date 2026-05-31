
import { Route } from "react-router-dom"
import { ProtectedLayout } from "../components/common/ProtectedLayout"
import { EmpleadosRoutes } from "./EmpleadosRoutes"
import { UsuariosRoutes } from "./UsuariosRoutes"
import { ClientesRoutes } from "./ClientesRoutes"
import { PedidosRoutes } from "./PedidosRoutes"
import { ReporteriaRoutes } from "./ReporteriaRoutes"
import Session from "@/pages/Session"
import { MaterialesRoutes } from "./MaterialesRoutes"
import PedidosMaestro from "@/features/pedidos/PedidosMaestro"

export const ProtectedRoutes = (
  <Route element={<ProtectedLayout />}>
    <Route path="/" element={<PedidosMaestro />} />
    {MaterialesRoutes}
    {PedidosRoutes}
    {ClientesRoutes}
    {EmpleadosRoutes}
    {ReporteriaRoutes}
    {UsuariosRoutes}
    <Route path="/sesion" element={<Session />} />
  </Route>
)