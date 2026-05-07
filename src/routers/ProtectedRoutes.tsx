
import { Route } from "react-router-dom"
import { ProtectedLayout } from "../components/common/ProtectedLayout"
import { EmpleadosRoutes } from "./EmpleadosRoutes"
import { UsuariosRoutes } from "./UsuariosRoutes"
import { ClientesRoutes } from "./ClientesRoutes"
import Session from "@/pages/Session"
import { MaterialesRoutes } from "./MaterialesRoutes"

function Home() {
  return <div className="text-xl font-semibold">Bienvenido a MultiMadera</div>
}

function Pedidos() {
  return <div className="text-xl font-semibold">Sección de Pedidos</div>
}

export const ProtectedRoutes = (
  <Route element={<ProtectedLayout />}>
    <Route path="/" element={<Home />} />
    {MaterialesRoutes}
    <Route path="/pedidos" element={<Pedidos />} />
    {ClientesRoutes}
    {EmpleadosRoutes}
    {UsuariosRoutes}
    <Route path="/sesion" element={<Session />} />
  </Route>
)