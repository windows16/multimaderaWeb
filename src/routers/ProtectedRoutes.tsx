
import { Route } from "react-router-dom"
import { ProtectedLayout } from "../components/common/ProtectedLayout"
import { EmpleadosRoutes } from "./EmpleadosRoutes"
import { UsuariosRoutes } from "./UsuariosRoutes"
import { ClientesRoutes } from "./ClientesRoutes"
import { PedidosRoutes } from "./PedidosRoutes"
import Session from "@/pages/Session"
import { MaterialesRoutes } from "./MaterialesRoutes"

function Home() {
  return <div className="text-xl font-semibold">Bienvenido a MultiMadera</div>
}

export const ProtectedRoutes = (
  <Route element={<ProtectedLayout />}>
    <Route path="/" element={<Home />} />
    {MaterialesRoutes}
    {PedidosRoutes}
    {ClientesRoutes}
    {EmpleadosRoutes}
    {UsuariosRoutes}
    <Route path="/sesion" element={<Session />} />
  </Route>
)