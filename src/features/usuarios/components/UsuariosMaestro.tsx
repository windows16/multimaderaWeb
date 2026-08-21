import { useState } from "react"
import { getAllUsuariosVinculados } from "@/features/usuarios/services/usuarios-service"
import type { UsuarioVinculadoCompleto, UsuarioRolCompleto } from "@/features/usuarios/models/UsuarioRol"
import { formatFechaHora } from "@/utils/Functions"
import { FaEdit, FaUserMinus, FaFileExcel, FaUserShield, FaEnvelope } from "react-icons/fa"
import { ExportToExcel } from "@/utils/ExportToExcel"
import { useFetch } from "@/hooks/useFetch"
import { useBusqueda } from "@/hooks/useBusqueda"
import CardGrid from "@/components/layout/CardGrid"
import MaestroLayout from "@/components/layout/MaestroLayout"
import UsuarioRolForm from "./UsuarioRolForm"
import EliminarUsuarioRolForm from "./EliminarUsuarioRolForm"
import VincularCuentaForm from "./VincularCuentaForm"
import CreateAuthUserForm from "./CreateAuthUserForm"

export default function MaestroUsuarios() {
  const { items: itemUsuariosVinculados, error, recargar: obtenerUsuarios, loading } = useFetch<UsuarioVinculadoCompleto>(getAllUsuariosVinculados)


  const { busqueda, setBusqueda, itemsFiltrados: usuariosFiltrados } = useBusqueda(itemUsuariosVinculados)

  // Modal Vincular Cuenta
  const [modalVincularAbierto, setModalVincularAbierto] = useState(false)

  // Modal crear cuenta Auth
  const [modalCrearAuthAbierto, setModalCrearAuthAbierto] = useState(false)

  // Modal crear / editar Rol
  const [modalUsuarioAbierto, setModalUsuarioAbierto] = useState(false)
  const [empleadoParaRol, setEmpleadoParaRol] = useState<number>(0)
  const [usuarioRolSeleccionado, setUsuarioRolSeleccionado] = useState<UsuarioRolCompleto | null>(null)

  // Modal eliminar (quitar rol)
  const [eliminarModalAbierto, setEliminarModalAbierto] = useState(false)
  const [usuarioRolParaEliminar, setUsuarioRolParaEliminar] = useState<UsuarioRolCompleto | null>(null)

  return (
    <MaestroLayout
      title="Usuarios del Sistema"
      menuOptions={[
        {
          label: "Exportar",
          icon: <FaFileExcel className="mr-2 text-green-600" />,
          onClick: () => ExportToExcel({
            data: usuariosFiltrados,
            fileName: "UsuariosSistema.xlsx",
            sheetName: "Usuarios",
            mapFn: (uv) => ({
              "No. Empleado": uv.numeroDeEmpleado,
              "Nombre": uv.tblPersonal?.nombre || "N/A",
              "Email": uv.email || "N/A",
              "Rol": uv.tblUsuarioRol?.tblRoles?.descripcion || "Sin Rol",
              "Fecha Vinculación": formatFechaHora(uv.fechaCreacion?.toString()),
            }),
          }),
        },
        {
          label: "Crear cuenta Auth",
          icon: <FaEnvelope className="mr-2 text-blue-600" />,
          onClick: () => setModalCrearAuthAbierto(true),
        }
      ]}
      busqueda={busqueda}
      onBusquedaChange={setBusqueda}
      recordCount={loading ? 0 : usuariosFiltrados.length}
      error={error}
      loading={loading}
      onAgregar={() => setModalVincularAbierto(true)}>
        
      <CardGrid
        items={usuariosFiltrados}
        isLoading={loading}
        getKey={(item) => item.idUsuario ?? item.numeroDeEmpleado}
        getTitulo={(item) => `${item.numeroDeEmpleado} - ${item.tblPersonal?.nombre || "Desconocido o de baja"}`}
        cardOptions={[
          {
            label: "Editar Rol",
            icon: <FaEdit className="w-3.5 h-3.5 mr-2" />,
            onClick: (item) => { 
              setEmpleadoParaRol(item.numeroDeEmpleado)
              setUsuarioRolSeleccionado(item.tblUsuarioRol || null)
              setModalUsuarioAbierto(true) 
            }
          },
          {
            label: "Quitar Rol",
            icon: <FaUserMinus className="w-3.5 h-3.5 mr-2" />,
            className: "text-amber-500 focus:text-amber-500 focus:bg-amber-50",
            separator: true, 
            onClick: (item) => { 
              if (item.tblUsuarioRol) {
                setUsuarioRolParaEliminar(item.tblUsuarioRol)
                setEliminarModalAbierto(true) 
              }
            }
          }
        ]}
        renderContent={(item) => (
          <div className="space-y-2 mt-2">
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <FaEnvelope className="text-gray-400 w-4 h-4 shrink-0" />
              <span>{item.email || "Sin correo asociado"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-700">
              <FaUserShield className={`w-4 h-4 shrink-0 ${item.tblUsuarioRol ? 'text-blue-500' : 'text-gray-400'}`} />
              <span className="font-medium">
                Rol: {item.tblUsuarioRol ? item.tblUsuarioRol.tblRoles?.descripcion : <span className="italic text-gray-400">Sin asignar</span>}
              </span>
            </div>
            <p className="text-xs text-gray-500 pt-1">Vinculado el: {formatFechaHora(item.fechaCreacion?.toString())}</p>
          </div>
        )}
      />

      {/* MODALES */}
      <VincularCuentaForm 
        isOpen={modalVincularAbierto}
        onClose={() => setModalVincularAbierto(false)}
        onSuccess={obtenerUsuarios}
      />

      <CreateAuthUserForm
        isOpen={modalCrearAuthAbierto}
        onClose={() => setModalCrearAuthAbierto(false)}
        onSuccess={obtenerUsuarios}
      />

      <UsuarioRolForm
        isOpen={modalUsuarioAbierto}
        onClose={() => { setModalUsuarioAbierto(false); setUsuarioRolSeleccionado(null) }}
        onSuccess={obtenerUsuarios}
        usuarioRolEditar={usuarioRolSeleccionado}
        numeroDeEmpleado={empleadoParaRol}
      />

      <EliminarUsuarioRolForm
        isOpen={eliminarModalAbierto}
        onClose={() => { setEliminarModalAbierto(false); setUsuarioRolParaEliminar(null) }}
        onSuccess={obtenerUsuarios}
        usuarioRol={usuarioRolParaEliminar} 
      />
    </MaestroLayout>
  )
}
