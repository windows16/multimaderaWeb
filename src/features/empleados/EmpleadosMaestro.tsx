
import { useState } from "react"
import { getAllEmpleados } from "../../services/empleados-service"
import type { Empleado } from "../../types/Empleados/Empleado"
import { formatFecha } from "../../utils/Functions"
import { FaEdit, FaUserMinus, FaUserPlus,FaFileExcel } from "react-icons/fa"
import EmpleadosForm from "./EmpleadosForm"
import BajaEmpleadosForm from "./BajaEmpleadosForm"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ExportToExcel } from "../../utils/ExportToExcel"
import ErrorAlert from "@/components/ErrorAlert"
import { useFetch } from "@/hooks/useFetch"
import { useBusqueda } from "@/hooks/useBusqueda"
import SearchBar from "@/components/SearchBar"
import FabButton from "@/components/FabButton"
import PageHeader from "@/components/PageHeader"
import RecordCount from "@/components/RecordCount"

export default function EmpleadosMaestro() {

  const { items: itemEmpleados, error, recargar: obtenerEmpleados } = useFetch<Empleado>(getAllEmpleados)
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

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <SearchBar
            value={busqueda}
            onChange={setBusqueda}
            placeholder="Buscar por nombre, teléfono, fechaNac..."
          />
      </div>
      <RecordCount count={empleadosFiltrados.length} />
      {/* TARJETAS */}
      <div className="my-2 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {empleadosFiltrados.map((item) => (
          <Card
            key={item.numeroDeEmpleado}
            className="shadow-md hover:shadow-lg transition">
            <CardHeader className="flex items-start justify-between">
              <CardTitle className="text-lg flex-1 truncate pr-2">
                {item.numeroDeEmpleado} - {item.nombre}
              </CardTitle>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-gray-400 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition text-xl leading-none tracking-widest">
                    ⋮
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setEmpleadoSeleccionado(item)
                      setModalEmpleadosAbierto(true)
                    }}
                  >
                    <FaEdit className="w-3.5 h-3.5 mr-2" />
                    Editar
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-500 focus:bg-red-50"
                    onClick={() => {
                      setEmpleadoParaBaja(item)
                      setBajaModalAbierto(true)
                    }}>
                      
                    <FaUserMinus className="w-3.5 h-3.5 mr-2" />
                    Dar de baja
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>

            <CardContent className="space-y-1 text-sm text-gray-500">
              <p>Tel: {item.telefono}</p>
              <p>Fecha de Nacimiento: {formatFecha(item.fechaNacimiento)}</p>
              <p>DPI: {item.dpi}</p>
              <p>Puesto: {item.idPuesto} - {item.puesto}</p>
            </CardContent>
          </Card>
        ))}
        
        <FabButton
          onClick={() => { setEmpleadoSeleccionado(null); setModalEmpleadosAbierto(true) }}
          icon={<FaUserPlus />}
        />
      </div>
    

      <ErrorAlert error={error} title="Error" />
      
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