
import { useState } from "react"
import { FaEdit, FaUserPlus,FaFileExcel, FaTrash, FaPlus} from "react-icons/fa"

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
import FabButton from "@/components/FabButton"
import RecordCount from "@/components/RecordCount"
import PageHeader from "@/components/PageHeader"
import { formatFecha } from "@/utils/Functions"

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
      <PageHeader
        title="Tipos de Cliente"
        menuOptions={[
          {
            label: "Exportar a Excel",
            icon: <FaFileExcel className="mr-2 text-green-600" />,
            onClick: () => ExportToExcel({
              data: tiposClienteFiltrados,
              fileName: "TiposCliente.xlsx",
              sheetName: "TiposCliente"
            }),
          }
        ]}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
      
        <SearchBar
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar por descripcion"/>
          
      </div>
      <RecordCount count={tiposClienteFiltrados.length} />
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

      <FabButton
          onClick={() => { 
            setTipoClienteSeleccionado(null)
            setModalTipoClienteAbierto(true)
          }}
          icon={<FaPlus />}
        />
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