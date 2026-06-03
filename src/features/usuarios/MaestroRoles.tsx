

import { getAllRoles} from "../../services/usuarios-service"

import { FaEdit, FaUserMinus, FaUserPlus,FaFileExcel, FaTrash } from "react-icons/fa"
import { Button } from "@/components/ui/button"

import { ExportToExcel } from "../../utils/ExportToExcel"
import ErrorAlert from "@/components/common/ErrorAlert"
import type { Rol } from "@/types/Usuarios/RoleConAccion"
import PageHeader from "@/components/layout/PageHeader"
import { useFetch } from "@/hooks/useFetch"
import { useBusqueda } from "@/hooks/useBusqueda"
import SearchBar from "@/components/common/SearchBar"
import RecordCount from "@/components/common/RecordCount"
import CardGrid from "@/components/layout/CardGrid"
import { useState } from "react"

export default function MaestroRoles() {

   const { items: itemRol, error, recargar: obtenerRolesConAcciones, handleError, loading } = useFetch<Rol>(getAllRoles)
    const { busqueda, setBusqueda, itemsFiltrados: rolesFiltrados } = useBusqueda(itemRol)
  

  // Modal crear / editar
  const [modalRolAbierto, setModalRolAbierto] = useState(false)
  const [rolSeleccionado, setRolSeleccionado] = useState<Rol | null>(null)

  // Modal baja
  const [bajaModalAbierto, setBajaModalAbierto] = useState(false)
  const [rolParaBaja, setRolParaBaja] = useState<Rol | null>(null)



  return (
    <div>

      <PageHeader
              title="Roles"
              menuOptions={[
                {
                  label: "Exportar a Excel",
                  icon: <FaFileExcel className="mr-2 text-green-600" />,
                  onClick: () => ExportToExcel({
                    data: rolesFiltrados,
                    fileName: "Roles.xlsx",
                    sheetName: "Roles"
                  }),
                }
              ]}
            />

      <SearchBar
              value={busqueda}
              onChange={setBusqueda}
              placeholder="Buscar por descripcion, precio..."/>

      <RecordCount count={loading ? 0 : rolesFiltrados.length} />

      <CardGrid
            items={rolesFiltrados}
            isLoading={loading}
            getKey={(item) => item.idRol ?? 0}
            getTitulo={(item) => `${item.idRol} - ${item.descripcion}`}
            cardOptions={[
              {
                label: "Editar",
                icon: <FaEdit className="w-3.5 h-3.5 mr-2" />,
                onClick: (item) => { 
                }
              },
              {
                label: "Eliminar",
                icon: <FaTrash className="w-3.5 h-3.5 mr-2" />,
                className: "text-red-500 focus:text-red-500 focus:bg-red-50",
                separator: true,
                onClick: (item) => {

                }
              }
            ]}
            renderContent={(item) => (
              <>
              </>
            )}
          />
      
      <ErrorAlert error={error}/>
      
      {/* MODALES */}
      {/* <EmpleadosForm
        isOpen={modalEmpleadosAbierto}
        onClose={() => { setModalEmpleadosAbierto(false); setEmpleadoSeleccionado(null) }}
        onSuccess={obtenerRolesConAcciones}
        empleadoEditar={empleadoSeleccionado} />

      <BajaEmpleadosForm
        isOpen={bajaModalAbierto}
        onClose={() => { setBajaModalAbierto(false); setEmpleadoParaBaja(null) }}
        onSuccess={obtenerRolesConAcciones}
        empleado={empleadoParaBaja} /> */}

    </div>
  )
}