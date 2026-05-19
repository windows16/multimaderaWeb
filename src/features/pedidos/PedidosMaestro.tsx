import { useState } from "react"
import { FaEdit, FaFileExcel, FaTrash, FaPlus } from "react-icons/fa"
import { ExportToExcel } from "@/utils/ExportToExcel"
import ErrorAlert from "@/components/common/ErrorAlert"
import type { Pedido } from "@/types/Pedidos/Pedido"
import { deletePedido, getAllPedidos } from "@/services/pedidos-service"
import PedidosForm from "./PedidosForm"
import { useFetch } from "@/hooks/useFetch"
import { useBusqueda } from "@/hooks/useBusqueda"
import SearchBar from "@/components/common/SearchBar"
import RecordCount from "@/components/common/RecordCount"
import PageHeader from "@/components/layout/PageHeader"
import FabButton from "@/components/common/FabButton"
import CardGrid from "@/components/layout/CardGrid"
import { useNavigate } from "react-router-dom"

export default function PedidosMaestro() {

  const { items: itemPedidos, error, recargar: obtenerPedidos, handleError } = useFetch<Pedido>(getAllPedidos)
  const { busqueda, setBusqueda, itemsFiltrados: pedidosFiltrados } = useBusqueda(itemPedidos)
  const navigate = useNavigate()
  // Modal crear / editar
  const [modalPedidoAbierto, setModalPedidoAbierto] = useState(false)
  const [PedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null)
  // Estado para el detalle

  async function eliminarPedido(pedido: Pedido) {
    if (!pedido.idPedido) return
    if (!confirm(`¿Desea eliminar el pedido #${pedido.idPedido}?`)) return
    try {
      await deletePedido(pedido.idPedido)
      await obtenerPedidos()
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <div>
      <PageHeader
        title="Pedidos"
        menuOptions={[
          {
            label: "Exportar a Excel",
            icon: <FaFileExcel className="mr-2 text-green-600" />,
            onClick: () => ExportToExcel({
              data: pedidosFiltrados,
              fileName: "Pedidos.xlsx",
              sheetName: "Pedidos"
            }),
          }
        ]}
      />

      <SearchBar
        value={busqueda}
        onChange={setBusqueda}
        placeholder="Buscar por dirección, propietario, albañil..." />

      <RecordCount count={pedidosFiltrados.length} />

      <CardGrid
        items={pedidosFiltrados}
        getKey={(item) => item.idPedido ?? 0}
        getTitulo={(item) => `${item.direccion}`}
        cardOptions={[
          {
            label: "Editar",
            icon: <FaEdit className="w-3.5 h-3.5 mr-2" />,
            onClick: (item) => { setPedidoSeleccionado(item); setModalPedidoAbierto(true) }
          },
          {
            label: "Eliminar",
            icon: <FaTrash className="w-3.5 h-3.5 mr-2" />,
            className: "text-red-500 focus:text-red-500 focus:bg-red-50",
            separator: true,
            onClick: (item) => eliminarPedido(item)
          }
        ]}
        renderContent={(item) => (
          <>
            <p>Albañil: {item.nombreAlbanil}</p>
            <p>Propietario: {item.nombrePropietario}</p>
            <p>Fecha inicio: {new Date(item.fechaInicio).toLocaleDateString()}</p>
            <p>Fecha fin: {new Date(item.fechaFin).toLocaleDateString()}</p>
            <p>{item.cancelado ? "Cancelado" : ""}</p>
          </>
        )}
        onItemClick={(item) => navigate(`/pedidos/${item.idPedido}`)}
      />

      <FabButton
        onClick={() => {
          setPedidoSeleccionado(null)
          setModalPedidoAbierto(true)
        }}
        icon={<FaPlus size={20} />}
      />
      <ErrorAlert error={error} title="Error" />

      {/* MODALES */}
      <PedidosForm
        isOpen={modalPedidoAbierto}
        onClose={() => { setModalPedidoAbierto(false); setPedidoSeleccionado(null) }}
        onSuccess={obtenerPedidos}
        pedidoEditar={PedidoSeleccionado} />
      
      
    </div>
  )
}
