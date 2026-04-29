import MaestroRoles from "@/features/usuarios/MaestroRoles"
import { Route } from "react-router-dom"

function Usuarios() {
    return <div className="text-xl font-semibold">Sección de Usuarios</div>
}
export const UsuariosRoutes = (
  <>
    <Route path="/usuarios"element={< Usuarios/>} />
    <Route path="/usuarios/roles" element={< MaestroRoles/>} />
  </>
)