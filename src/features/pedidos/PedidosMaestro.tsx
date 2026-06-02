import { useMemo, useState } from "react"
import { FaEdit, FaFileExcel, FaTrash, FaPlus, FaMoneyCheck } from "react-icons/fa"
import { ExportToExcel } from "@/utils/ExportToExcel"
import ErrorAlert from "@/components/common/ErrorAlert"
import type { Pedido } from "@/types/Pedidos/Pedido"
import { deletePedido, getAllPedidos, cancelarPedido } from "@/services/pedidos-service"
import PedidosForm from "./PedidosForm"
import { useFiltros } from "@/hooks/useFiltros"
import RecordCount from "@/components/common/RecordCount"
import PageHeader from "@/components/layout/PageHeader"
import FabButton from "@/components/common/FabButton"
import CardGrid from "@/components/layout/CardGrid"
import { useNavigate } from "react-router-dom"
import { formatFecha } from "@/utils/Functions"
import { PanelFiltros } from "@/components/common/PanelFiltros"
import { usePanelFiltros } from "@/hooks/usePanelFiltros"
import { FiltroSelect } from "@/components/common/FiltroSelect"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useError } from "@/hooks/useError"
import { usePaginacion } from "@/hooks/usePaginacion"
import { Paginacion } from "@/components/common/Paginacion"

export default function PedidosMaestro() {

    const { 
      items: itemPedidos, loading, page, setPage, meta, recargar: obtenerPedidos 
    } = usePaginacion<Pedido>({ 
      fetchFn: getAllPedidos, 
      initialLimit: 10
    })
    const { error, handleError } = useError()
    
  const { filtros, filtrosActivos, itemsFiltrados: pedidosFiltrados, setFiltro, limpiarTodos: limpiarFiltros } =
      useFiltros<Pedido>(itemPedidos)
  const navigate = useNavigate()

  const opcionesAlbanil = useMemo(() =>
      [...new Set(itemPedidos.map(p => p.nombreAlbanil).filter(Boolean))] as string[],
      [itemPedidos]
    )
    const opcionesPropietario = useMemo(() =>
      [...new Set(itemPedidos.map(p => p.nombrePropietario).filter(Boolean))] as string[],
      [itemPedidos]
    )
  const { abierto, toggle } = usePanelFiltros()
  
  // Modal crear / editar
  const [modalPedidoAbierto, setModalPedidoAbierto] = useState(false)
  const [PedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null)
  

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

  async function cancelarPedidoHandler(pedido: Pedido) {
    if (!pedido.idPedido) return
    if (!confirm(`¿Desea marcar como cancelado el pedido #${pedido.idPedido}?`)) return
    try {
      await cancelarPedido(pedido.idPedido)
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
          },
          
        ]}
      />

      <div className="flex gap-4 mb-4">
        <RecordCount count={loading ? 0 : pedidosFiltrados.length} />
        <PanelFiltros.Trigger
            className="ml-auto"
            abierto={abierto}
            onToggle={toggle}
            cantidadActivos={filtrosActivos.length}
          />
      </div>
      <PanelFiltros.Panel abierto={abierto} onLimpiar={limpiarFiltros} cantidadActivos={filtrosActivos.length}>
        <FiltroSelect
          label="Albañil"
          opciones={opcionesAlbanil}
          value={filtros.find(f => f.campo === "nombreAlbanil")?.valor ?? ""}
          onChange={v => setFiltro({ campo: "nombreAlbanil", operador: "equals", valor: v })}
        />
        <FiltroSelect
          label="Propietario"
          opciones={opcionesPropietario}
          value={filtros.find(f => f.campo === "nombrePropietario")?.valor ?? ""}
          onChange={v => setFiltro({ campo: "nombrePropietario", operador: "equals", valor: v })}
        />
        <div className="space-y-1.5">
          <Label className="text-xs">Fecha inicio (desde)</Label>
          <Input
            type="date"
            value={filtros.find(f => f.campo === "fechaInicio")?.valor ?? ""}
            onChange={e => setFiltro({ campo: "fechaInicio", operador: "gte", valor: e.target.value })}
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Fecha fin (hasta)</Label>
          <Input
            type="date"
            value={filtros.find(f => f.campo === "fechaFin")?.valor ?? ""}
            onChange={e => setFiltro({ campo: "fechaFin", operador: "lte", valor: e.target.value })}
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Direccion</Label>
          <Input
            value={filtros.find(f => f.campo === "direccion")?.valor ?? ""}
            onChange={e => setFiltro({ campo: "direccion", operador: "includes", valor: e.target.value })}
            className="h-8 text-sm"
          />
        </div>
      </PanelFiltros.Panel>
      <CardGrid
        items={pedidosFiltrados}
        isLoading={loading}
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
          },
          {
            label: "Marcar cancelado",
            icon: <FaMoneyCheck  className="w-3.5 h-3.5 mr-2" />,
            onClick: (item) => cancelarPedidoHandler(item)
          }
        ]}
        renderContent={(item) => (
          <>
            <p>Albañil: {item.nombreAlbanil}</p>
            <p>Propietario: {item.nombrePropietario}</p>
            <p>Fecha inicio: {formatFecha(item.fechaInicio)}</p>
            <p>Fecha fin: {formatFecha(item.fechaFin)}</p>
            <p>{item.cancelado ? <span className="text-emerald-600">Cancelado</span> : ""}</p>
          </>
        )}
        onItemClick={(item) => navigate(`/pedidos/${item.idPedido}`, { state: { pedido: item } })}
      />
      <Paginacion
            page={page}
            totalPages={meta.totalPages > 0 ? meta.totalPages : Math.ceil((meta.total || 1) / 10)}
            onChange={setPage}
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
