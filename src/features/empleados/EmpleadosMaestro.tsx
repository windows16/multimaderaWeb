
import { useState } from "react"
import { getAllEmpleados } from "../../services/empleados-service"
import type { Empleado } from "../../types/Empleados/Empleado"
import { formatFecha } from "../../utils/Functions"
import { FaEdit, FaUserMinus, FaUserPlus,FaFileExcel } from "react-icons/fa"
import EmpleadosForm from "./EmpleadosForm"
import BajaEmpleadosForm from "./BajaEmpleadosForm"
import { ExportToExcel } from "../../utils/ExportToExcel"
import ErrorAlert from "@/components/common/ErrorAlert"
import { useFetch } from "@/hooks/useFetch"
import { useBusqueda } from "@/hooks/useBusqueda"
import SearchBar from "@/components/common/SearchBar"
import FabButton from "@/components/common/FabButton"
import PageHeader from "@/components/layout/PageHeader"
import RecordCount from "@/components/common/RecordCount"
import CardGrid from "@/components/layout/CardGrid"

export default function EmpleadosMaestro() {

  const { items: itemEmpleados, error, recargar: obtenerEmpleados, loading } = useFetch<Empleado>(getAllEmpleados)
  const { busqueda, setBusqueda, itemsFiltrados: empleadosFiltrados } = useBusqueda(itemEmpleados)

  // Modal crear / editar
  const [modalEmpleadosAbierto, setModalEmpleadosAbierto] = useState(false)
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null)

  // Modal baja
  const [bajaModalAbierto, setBajaModalAbierto] = useState(false)
  const [empleadoParaBaja, setEmpleadoParaBaja] = useState<Empleado | null>(null)


  return (
    <div>

      <PageHeader
        title="Empleados"
        menuOptions={[
          {
            label: "Exportar",
            icon: <FaFileExcel className="mr-2 text-green-600" />,
            onClick: () => ExportToExcel({
                data: empleadosFiltrados,
                fileName: "empleados.xlsx",
                sheetName: "Empleados",
                mapFn: (emp) => ({
                  "No. Empleado": emp.numeroDeEmpleado,
                  "Nombre": emp.nombre,
                  "Teléfono": emp.telefono,
                  "Fecha Nacimiento": formatFecha(emp.fechaNacimiento),
                  "DPI": emp.dpi,
                }),
              }),
          }
        ]}
      />

      <SearchBar
        value={busqueda}
        onChange={setBusqueda}
        placeholder="Buscar por nombre, teléfono, fechaNac..."
      />

      <RecordCount count={loading ? 0 : empleadosFiltrados.length} />
      
      <CardGrid
        items={empleadosFiltrados}
        isLoading={loading}
        getKey={(item) => item.numeroDeEmpleado ?? 0}
        getTitulo={(item) => `${item.numeroDeEmpleado} - ${item.nombre}`}
        cardOptions={[
          {
            label: "Editar",
            icon: <FaEdit className="w-3.5 h-3.5 mr-2" />,
            onClick: (item) => { setEmpleadoSeleccionado(item); setModalEmpleadosAbierto(true) }
          },
          {
            label: "Dar de baja",
            icon: <FaUserMinus className="w-3.5 h-3.5 mr-2" />,
            className: "text-red-500 focus:text-red-500 focus:bg-red-50",
            separator: true,
            onClick: (item) => { setEmpleadoParaBaja(item); setBajaModalAbierto(true) }
          }
        ]}
        renderContent={(item) => (
          <>
            <p>Tel: {item.telefono}</p>
            <p>Fecha de Nacimiento: {formatFecha(item.fechaNacimiento)}</p>
            <p>DPI: {item.dpi}</p>
            <p>Puesto: {item.puesto}</p>
          </>
        )}
      />
        
      <FabButton
        onClick={() => { setEmpleadoSeleccionado(null); setModalEmpleadosAbierto(true) }}
        icon={<FaUserPlus />}
      />

      <ErrorAlert error={error} />
      
      {/* MODALES */}
      <EmpleadosForm
        isOpen={modalEmpleadosAbierto}
        onClose={() => { setModalEmpleadosAbierto(false); setEmpleadoSeleccionado(null) }}
        onSuccess={obtenerEmpleados}
        empleadoEditar={empleadoSeleccionado} />

      <BajaEmpleadosForm
        isOpen={bajaModalAbierto}
        onClose={() => { setBajaModalAbierto(false); setEmpleadoParaBaja(null) }}
        onSuccess={obtenerEmpleados}
        empleado={empleadoParaBaja} />

    </div>
  )
}