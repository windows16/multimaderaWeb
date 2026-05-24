import { useState } from "react"
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa"
import ErrorAlert from "@/components/common/ErrorAlert"
import type { DetallePedido, Pedido } from "@/types/Pedidos/Pedido"
import { deleteDetallePedido, getDetallesPedido } from "@/services/pedidos-service"
import DetallesPedidosForm from "./DetallesPedidosForm"
import { useFetch } from "@/hooks/useFetch"
import RecordCount from "@/components/common/RecordCount"
import PageHeader from "@/components/layout/PageHeader"
import FabButton from "@/components/common/FabButton"
import CardGrid from "@/components/layout/CardGrid"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"


export default function DetallesPedidosMaestro() {
  const { idPedido } = useParams()
  const pedidoId = Number(idPedido)
  const navigate = useNavigate()
  const { items: itemDetalles, error, recargar: obtenerDetalles, handleError, loading } = useFetch(
    () => getDetallesPedido(pedidoId)
  )

  // 1. Obtenemos el estado de la navegación
  const location = useLocation()
  // 2. Extraemos el pedido (añadiendo tipado seguro)
  const pedidoCompleto = location.state?.pedido as Pedido | undefined

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
        title={`${pedidoCompleto?.direccion ?? "--"}`}
        menuOptions={[]}
      />

      <RecordCount count={loading ? 0 : itemDetalles.length} />
      {/* Subtotal */}
      <div className="flex justify-end mb-4">
          <p className="text-md font-semibold text-right">
            SubTotal: Q{itemDetalles.reduce((acc, item) => acc + (item.total || 0), 0).toFixed(2)}
          </p>
      </div>
      <CardGrid
        items={itemDetalles}
        getKey={(item) => item.idDetallePedido ?? 0}
        getTitulo={(item) => `${item.material}`}
        isLoading={loading}
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
            <p>Cantidad: {item.cantidad}</p>
            <p>Total: Q{item.total}</p>
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
