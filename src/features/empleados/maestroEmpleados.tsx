
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxEmpty,
} from "@/components/ui/combobox"
import { ExportToExcel } from "../../utils/ExportToExcel"
import ErrorAlert from "@/components/ErrorAlert"
import { useFetch } from "@/hooks/useFetch"
import { useFiltro } from "@/hooks/useFiltro"

export default function MaestroEmpleados() {

  const { items: itemEmpleados, error, recargar: obtenerEmpleados } = useFetch<Empleado>(getAllEmpleados)
  const {
    campoFiltro, setCampoFiltro,
    valorFiltro, setValorFiltro,
    valorCombobox, setValorCombobox,
    valoresFiltro,
    itemsFiltrados: empleadosFiltrados,
    limpiarFiltro,
  } = useFiltro(itemEmpleados)

  // Modal crear / editar
  const [modalEmpleadosAbierto, setModalEmpleadosAbierto] = useState(false)
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null)

  // Modal baja
  const [bajaModalAbierto, setBajaModalAbierto] = useState(false)
  const [empleadoParaBaja, setEmpleadoParaBaja] = useState<Empleado | null>(null)


  return (
    <div>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Empleados</h1>
      </div>

      {/* FILTROS */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mb-6">
        <Select
          value={campoFiltro}
          onValueChange={(value) => {
            setCampoFiltro(value)
            setValorFiltro("")
          }}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="numeroDeEmpleado">numeroDeEmpleado</SelectItem>
            <SelectItem value="nombre">nombre</SelectItem>
            <SelectItem value="puesto">puesto</SelectItem>
            <SelectItem value="dpi">dpi</SelectItem>
          </SelectContent>
        </Select>

        <Combobox items={valoresFiltro}>
          <ComboboxInput
            placeholder="Escribe para filtrar..."
            value={valorCombobox}
            onChange={(e) => setValorCombobox(e.target.value)}/>

          <ComboboxContent>
            <ComboboxEmpty>No encontrado</ComboboxEmpty>

            <ComboboxList>
              {(item) => (
                <ComboboxItem
                  key={item}
                  value={item}
                  onClick={() => {setValorCombobox(item); setValorFiltro(item)}}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        <Button
          onClick={() => {limpiarFiltro()}}
          className="bg-blue-600">
          Limpiar Filtro
        </Button>
      </div>
      <div className="flex items-center  justify-end mb-6">
        <div className="flex gap-2">
          <Button onClick={() => { setEmpleadoSeleccionado(null); setModalEmpleadosAbierto(true) }}
            className="bg-blue-600"><FaUserPlus />
            Nuevo
          </Button>

          <Button onClick={() => 
            ExportToExcel({
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
            })
          } className="bg-green-600"><FaFileExcel/>
            Exportar
          </Button>
          
        </div>
      </div>
      <div className="mb-4 text-sm text-gray-600">
        Mostrando {empleadosFiltrados.length} {empleadosFiltrados.length !== 1? "registros" : "registro"} 
      </div>
      
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