
import { useState } from "react"
import { FaEdit,FaFileExcel, FaTrash, FaPlus} from "react-icons/fa"
import { ExportToExcel } from "@/utils/ExportToExcel"
import ErrorAlert from "@/components/common/ErrorAlert"
import { useFetch } from "@/hooks/useFetch"
import { useBusqueda } from "@/hooks/useBusqueda"
import SearchBar from "@/components/common/SearchBar"
import type { TipoCliente } from "@/types/Clientes/TipoCliente"
import { deleteTipoCliente, getAllTiposCliente } from "@/services/tipos-cliente-service"
import TiposClienteForm from "./TiposClienteForm"
import FabButton from "@/components/common/FabButton"
import RecordCount from "@/components/common/RecordCount"
import PageHeader from "@/components/layout/PageHeader"
import CardGrid from "@/components/layout/CardGrid"

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

      <SearchBar
        value={busqueda}
        onChange={setBusqueda}
        placeholder="Buscar por descripcion"/>

      <RecordCount count={tiposClienteFiltrados.length} />
      
      <CardGrid
        items={tiposClienteFiltrados}
        getKey={(item) => item.idTipoCliente ?? 0}
        getTitulo={(item) => `${item.idTipoCliente} - ${item.descripcion}`}
        cardOptions={[
          {
            label: "Editar",
            icon: <FaEdit className="w-3.5 h-3.5 mr-2" />,
            onClick: (item) => { setTipoClienteSeleccionado(item); setModalTipoClienteAbierto(true) }
          },
          {
            label: "Eliminar",
            icon: <FaTrash className="w-3.5 h-3.5 mr-2" />,
            className: "text-red-500 focus:text-red-500 focus:bg-red-50",
            separator: true,
            onClick: (item) => eliminarCliente(item)
          }
        ]}
        renderContent={() => null}
      />

      <FabButton
          onClick={() => { 
            setTipoClienteSeleccionado(null)
            setModalTipoClienteAbierto(true)
          }}
          icon={<FaPlus />} />

      <ErrorAlert error={error} title="Error" />

      <TiposClienteForm
        isOpen={modalTipoClienteAbierto}
        onClose={() => { setModalTipoClienteAbierto(false); setTipoClienteSeleccionado(null) }}
        onSuccess={obtenerTiposCliente}
        tipoClienteEditar={tipoClienteSeleccionado} />
    </div>
  )
}