import MaestroRoles from "@/features/usuarios/components/RolesMaestro"
import MaestroUsuarios from "@/features/usuarios/components/UsuariosMaestro"
import { Route } from "react-router-dom"

export const UsuariosRoutes = (
  <>
    <Route path="/usuarios/auth" element={<MaestroUsuarios />} />
    <Route path="/usuarios/roles" element={<MaestroRoles />} />
  </>
)