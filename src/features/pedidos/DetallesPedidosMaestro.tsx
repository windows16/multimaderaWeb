import { useState } from "react"
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa"
import ErrorAlert from "@/components/common/ErrorAlert"
import type { DetallePedido } from "@/types/Pedidos/Pedido"
import { deleteDetallePedido, getDetallesPedido } from "@/services/pedidos-service"
import DetallesPedidosForm from "./DetallesPedidosForm"
import { useFetch } from "@/hooks/useFetch"
import RecordCount from "@/components/common/RecordCount"
import PageHeader from "@/components/layout/PageHeader"
import FabButton from "@/components/common/FabButton"
import CardGrid from "@/components/layout/CardGrid"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"


export default function DetallesPedidosMaestro() {
  const { idPedido } = useParams()
  const pedidoId = Number(idPedido)
  const navigate = useNavigate()
  const { items: itemDetalles, error, recargar: obtenerDetalles, handleError } = useFetch(
    () => getDetallesPedido(pedidoId)
  )

  // Modal crear / editar
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false)
  const [detalleSeleccionado, setDetalleSeleccionado] = useState<DetallePedido | null>(null)
  

  async function eliminarDetalle(detalle: DetallePedido) {
    if (!detalle.idDetallePedido) return
    if (!confirm(`¿Desea eliminar este detalle?`)) return
    try {
      await deleteDetallePedido(detalle.idDetallePedido)
      await obtenerDetalles()
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <div>
      <Button
        variant="outline"
        onClick={() => navigate("/pedidos")}
        className="mb-4">
          
        <ArrowLeft className="w-4 h-4 mr-2" />
      
      </Button>
      <PageHeader
        title="Detalles del Pedido"
        menuOptions={[]}
      />

      <RecordCount count={itemDetalles.length} />

      <CardGrid
        items={itemDetalles}
        getKey={(item) => item.idDetallePedido ?? 0}
        getTitulo={(item) => `Material: ${item.material}`}
        cardOptions={[
          {
            label: "Editar",
            icon: <FaEdit className="w-3.5 h-3.5 mr-2" />,
            onClick: (item) => { setDetalleSeleccionado(item); setModalDetalleAbierto(true) }
          },
          {
            label: "Eliminar",
            icon: <FaTrash className="w-3.5 h-3.5 mr-2" />,
            className: "text-red-500 focus:text-red-500 focus:bg-red-50",
            separator: true,
            onClick: (item) => eliminarDetalle(item)
          }
        ]}
        renderContent={(item) => (
          <>
            <p>Material: {item.material}</p>
            <p>Cantidad: {item.cantidad}</p>
          </>
        )}
      />

      <FabButton
        onClick={() => {
          setDetalleSeleccionado(null)
          setModalDetalleAbierto(true)
        }}
        icon={<FaPlus size={20} />}
      />
      <ErrorAlert error={error} title="Error" />

      {/* MODALES */}
      <DetallesPedidosForm
        isOpen={modalDetalleAbierto}
        onClose={() => { setModalDetalleAbierto(false); setDetalleSeleccionado(null) }}
        onSuccess={obtenerDetalles}
        detalleEditar={detalleSeleccionado}
        idPedidoActual={pedidoId} />
    </div>
  )
}
