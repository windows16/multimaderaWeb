
import { useState } from "react"
import { FaEdit, FaUserPlus,FaFileExcel, FaTrash } from "react-icons/fa"

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
import type { Puesto } from "@/types/Empleados/Puesto"
import { getAllPuestos, deletePuesto } from "../../services/empleados-service"
import { ExportToExcel } from "@/utils/ExportToExcel"
import PuestosForm from "./PuestosForm"
import ErrorAlert from "@/components/ErrorAlert"
import { useFetch } from "@/hooks/useFetch"
import { useFiltro } from "@/hooks/useFiltro"

export default function MaestroPuestos() {

   const { items: itemPuesto, error, recargar: obtenerPuesto, handleError } = useFetch<Puesto>(getAllPuestos)
  const {
    campoFiltro, setCampoFiltro,
    valorFiltro, setValorFiltro,
    valorCombobox, setValorCombobox,
    valoresFiltro,
    itemsFiltrados: PuestoFiltrados,
    limpiarFiltro,
  } = useFiltro(itemPuesto)

 // Modal crear / editar
  const [modalPuestoAbierto, setModalPuestoAbierto] = useState(false)
  const [PuestoSeleccionado, setPuestoSeleccionado] = useState<Puesto | null>(null)


  async function eliminarPuesto(puesto: Puesto) {
    if (!puesto.idPuesto) return
    if (!confirm(`¿Desea eliminar el puesto ${puesto.puesto}?`)) return
    try {
      await deletePuesto(puesto.idPuesto)
      await obtenerPuesto()
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <div>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Puesto</h1>
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
            <SelectItem value="idPuesto">idPuesto</SelectItem>
            <SelectItem value="puesto">puesto</SelectItem>
            <SelectItem value="descripcion">descripcion</SelectItem>
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
          onClick={() => { limpiarFiltro() }}
          className="bg-blue-600">
          Limpiar Filtro
        </Button>
      </div>

      <div className="flex items-center  justify-end mb-6">
        <div className="flex gap-2">
          
          <Button onClick={() => {  
            setPuestoSeleccionado(null)
            setModalPuestoAbierto(true)
          }}
            className="bg-blue-600"><FaUserPlus />
            Nuevo
          </Button>

          <Button onClick={() => 
            ExportToExcel({
              data: PuestoFiltrados,
              fileName: "Puesto.xlsx",
              sheetName: "Puesto"
            })
          } className="bg-green-600"><FaFileExcel/>
            Exportar
          </Button>
          
        </div>
      </div>

      {/* TARJETAS */}
      <div className="my-2 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PuestoFiltrados.map((item) => (
          <Card
            key={item.idPuesto}
            className="shadow-md hover:shadow-lg transition">
            <CardHeader className="flex items-start justify-between">
              <CardTitle className="text-lg flex-1 truncate pr-2">
                {item.idPuesto} - {item.puesto}
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
                      setPuestoSeleccionado(item)
                      setModalPuestoAbierto(true)
                    }}
                  >
                    <FaEdit className="w-3.5 h-3.5 mr-2" />
                    Editar
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-500 focus:bg-red-50"
                    onClick={() => {
                      eliminarPuesto(item)
                    }}>
                    <FaTrash className="w-3.5 h-3.5 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>

            <CardContent className="space-y-1 text-sm text-gray-500">
              <p>Descripcion: {item.descripcion}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <ErrorAlert error={error} title="Error" />

      {/* MODALES */}
      <PuestosForm
        isOpen={modalPuestoAbierto}
        onClose={() => { setModalPuestoAbierto(false); setPuestoSeleccionado(null) }}
        onSuccess={obtenerPuesto}
        puestoEditar={PuestoSeleccionado} />
    </div>
  )
}