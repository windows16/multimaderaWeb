

import { getAllRoles} from "../../services/usuarios-service"

import { FaEdit, FaFileExcel, FaTrash } from "react-icons/fa"

import { ExportToExcel } from "../../utils/ExportToExcel"
import type { Rol } from "@/types/Usuarios/RoleConAccion"
import { useFetch } from "@/hooks/useFetch"
import { useBusqueda } from "@/hooks/useBusqueda"
import CardGrid from "@/components/layout/CardGrid"
import { useState } from "react"
import MaestroLayout from "@/components/layout/MaestroLayout"

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
    <MaestroLayout
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
      busqueda={busqueda}
      onBusquedaChange={setBusqueda}
      searchPlaceholder="Buscar por descripcion, precio..."
      recordCount={rolesFiltrados.length}
      error={error}
      loading={loading}
      onAgregar={() => {
        setRolSeleccionado(null)
        setModalRolAbierto(true)
      }}
    >

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

    </MaestroLayout>
  )
}