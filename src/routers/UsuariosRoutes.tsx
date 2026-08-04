import MaestroRoles from "@/features/usuarios/RolesMaestro"
import MaestroUsuarios from "@/features/usuarios/UsuariosMaestro"
import { Route } from "react-router-dom"

export const UsuariosRoutes = (
  <>
    <Route path="/usuarios/auth" element={<MaestroUsuarios />} />
    <Route path="/usuarios/roles" element={<MaestroRoles />} />
  </>
)