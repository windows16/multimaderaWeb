
import { useState } from "react"
import { FaEdit, FaUserPlus,FaFileExcel, FaTrash} from "react-icons/fa"

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

import { ExportToExcel } from "@/utils/ExportToExcel"
import ErrorAlert from "@/components/ErrorAlert"
import { useFetch } from "@/hooks/useFetch"
import { useBusqueda } from "@/hooks/useBusqueda"
import SearchBar from "@/components/SearchBar"
import type { TipoCliente } from "@/types/Clientes/TipoCliente"
import { deleteTipoCliente, getAllTiposCliente } from "@/services/tipos-cliente-service"
import TiposClienteForm from "./TiposClienteForm"

export default function TiposClienteMaestro() {

  const { items: itemTipoCliente, error, recargar: obtenerTiposCliente, handleError } = useFetch<TipoCliente>(getAllTiposCliente)
  const { busqueda, setBusqueda, itemsFiltrados: tiposClienteFiltrados } = useBusqueda(itemTipoCliente)

 // Modal crear / editar
  const [modalTipoClienteAbierto, setModalTipoClienteAbierto] = useState(false)
  const [tipoClienteSeleccionado, setTipoClienteSeleccionado] = useState<TipoCliente | null>(null)


  async function eliminarCliente(tipoCliente: TipoCliente) {
    if (!tipoCliente.idTipoCliente) return
    if (!confirm(`¿Desea eliminar el tipoCliente ${tipoCliente.descripcion}?`)) return
    try {
      await deleteTipoCliente(tipoCliente.idTipoCliente)
      await obtenerTiposCliente()
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">TiposCliente</h1>
        <div className="text-sm text-gray-600">
            {tiposClienteFiltrados.length} {tiposClienteFiltrados.length !== 1? "registros" : "registro"} 
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
      
        <SearchBar
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar por descripcion"/>
          
        <div className="flex gap-3">

          <Button onClick={() => {
            setTipoClienteSeleccionado(null)
            setModalTipoClienteAbierto(true)
          }} className="bg-blue-600">
            <FaUserPlus /> Nuevo TipoCliente
          </Button>

          <Button onClick={() =>
            ExportToExcel({
              data: tiposClienteFiltrados,
              fileName: "TipoCliente.xlsx",
              sheetName: "TipoCliente"
            })
          } className="bg-green-600">
            <FaFileExcel /> Exportar
          </Button>
        </div>
      </div>

      {/* TARJETAS */}
      <div className="my-2 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tiposClienteFiltrados.map((item) => (
          <Card
            key={item.idTipoCliente}
            className="shadow-md hover:shadow-lg transition">
            <CardHeader className="flex items-start justify-between">
              <CardTitle className="text-lg flex-1 truncate pr-2">
                {item.idTipoCliente} - {item.descripcion}
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
                      setTipoClienteSeleccionado(item)
                      setModalTipoClienteAbierto(true)
                    }}>
                    <FaEdit className="w-3.5 h-3.5 mr-2" />
                    Editar
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-500 focus:bg-red-50"
                    onClick={() => {
                      eliminarCliente(item)
                    }}>
                    <FaTrash className="w-3.5 h-3.5 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
          </Card>
        ))}
      </div>

      <ErrorAlert error={error} title="Error" />

      {/* MODALES */}
      <TiposClienteForm
        isOpen={modalTipoClienteAbierto}
        onClose={() => { setModalTipoClienteAbierto(false); setTipoClienteSeleccionado(null) }}
        onSuccess={obtenerTiposCliente}
        tipoClienteEditar={tipoClienteSeleccionado} />
    </div>
  )
}