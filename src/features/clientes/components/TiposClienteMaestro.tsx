
import { useState } from "react"
import { FaEdit,FaFileExcel, FaTrash} from "react-icons/fa"
import { ExportToExcel } from "@/utils/ExportToExcel"
import { useFetch } from "@/hooks/useFetch"
import { useBusqueda } from "@/hooks/useBusqueda"
import type { TipoCliente } from "@/features/clientes/models/TipoCliente"
import { deleteTipoCliente, getAllTiposCliente } from "@/features/clientes/services/clientes-service"
import TiposClienteForm from "./TiposClienteForm"
import CardGrid from "@/components/layout/CardGrid"
import MaestroLayout from "@/components/layout/MaestroLayout"

export default function TiposClienteMaestro() {

  const { items: itemTipoCliente, error, recargar: obtenerTiposCliente, handleError, loading } = useFetch<TipoCliente>(getAllTiposCliente)
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
    <MaestroLayout
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
      busqueda={busqueda}
      onBusquedaChange={setBusqueda}
      recordCount={loading ? 0 : tiposClienteFiltrados.length}
      error={error}
      loading={loading}
      onAgregar={() => {
        setTipoClienteSeleccionado(null)
        setModalTipoClienteAbierto(true)
      }}
    >
      <CardGrid
        items={tiposClienteFiltrados}
        isLoading={loading}
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

      <TiposClienteForm
        isOpen={modalTipoClienteAbierto}
        onClose={() => { setModalTipoClienteAbierto(false); setTipoClienteSeleccionado(null) }}
        onSuccess={obtenerTiposCliente}
        tipoClienteEditar={tipoClienteSeleccionado} />
    </MaestroLayout>
  )
}