import { useState, useEffect, useMemo } from "react"
import { Printer, ChevronDown, ChevronUp, Package, ClipboardList } from "lucide-react"
import { getAllPedidos, getDetallesPedido } from "@/services/pedidos-service"
import type { Pedido, DetallePedido } from "@/types/Pedidos/Pedido"
import { formatFecha } from "@/utils/Functions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFiltros } from "@/hooks/useFiltros"
import { usePanelFiltros } from "@/hooks/usePanelFiltros"
import { usePaginacion } from "@/hooks/usePaginacion"
import { FiltroSelect } from "@/components/common/FiltroSelect"
import { PanelFiltros } from "@/components/common/PanelFiltros"
import RecordCount from "@/components/common/RecordCount"
import { Paginacion } from "@/components/common/Paginacion"

interface PedidoConDetalles extends Pedido {
  detalles: DetallePedido[]
  subtotal: number
}

async function fetchPedidosPaginados(page: number, limit: number) {
  const respuesta = await getAllPedidos(page, limit)
  return {
    data: (respuesta.data || []).filter((p: Pedido) => !p.cancelado),
    meta: respuesta.meta,
  }
}

export default function ReportePedidosActivos() {
  const [expandidos, setExpandidos] = useState<Set<number>>(new Set())
  const [todoExpandido, setTodoExpandido] = useState(false)

  // ─── Paginación ────────────────────────────────────────────────────────────
  const {
    items: pedidosPaginados,
    loading,
    error,
    page,
    setPage,
    meta,
    recargar,
  } = usePaginacion<Pedido>({
    fetchFn: fetchPedidosPaginados,
    initialLimit: 10,
  })

  // ─── Enriquecer cada página con sus detalles ───────────────────────────────
  const [pedidosConDetalles, setPedidosConDetalles] = useState<PedidoConDetalles[]>([])
  const [loadingDetalles, setLoadingDetalles] = useState(false)

  useEffect(() => {
    if (pedidosPaginados.length === 0) {
      setPedidosConDetalles([])
      return
    }
    let activo = true
    async function enriquecer() {
      setLoadingDetalles(true)
      const conDetalles: PedidoConDetalles[] = await Promise.all(
        pedidosPaginados.map(async (pedido) => {
          try {
            const detalles = await getDetallesPedido(pedido.idPedido!)
            const subtotal = detalles.reduce((acc: number, d: DetallePedido) => acc + (d.total || 0), 0)
            return { ...pedido, detalles, subtotal }
          } catch {
            return { ...pedido, detalles: [], subtotal: 0 }
          }
        })
      )
      if (activo) {
        setPedidosConDetalles(conDetalles)
        setExpandidos(new Set())
        setTodoExpandido(false)
      }
      setLoadingDetalles(false)
    }
    enriquecer()
    return () => { activo = false }
  }, [pedidosPaginados])

  // ─── Filtros locales (sobre la página actual) ──────────────────────────────
  const { filtros, filtrosActivos, itemsFiltrados: pedidosFiltrados, setFiltro, limpiarTodos: limpiarFiltros } =
    useFiltros<PedidoConDetalles>(pedidosConDetalles)
  const { abierto, toggle } = usePanelFiltros()

  const opcionesAlbanil = useMemo(() =>
    [...new Set(pedidosConDetalles.map(p => p.nombreAlbanil).filter(Boolean))] as string[],
    [pedidosConDetalles]
  )
  const opcionesPropietario = useMemo(() =>
    [...new Set(pedidosConDetalles.map(p => p.nombrePropietario).filter(Boolean))] as string[],
    [pedidosConDetalles]
  )

  function togglePedido(id: number) {
    setExpandidos(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleTodos() {
    if (todoExpandido) {
      setExpandidos(new Set())
    } else {
      setExpandidos(new Set(pedidosFiltrados.map(p => p.idPedido!)))
    }
    setTodoExpandido(prev => !prev)
  }

  function fmtMonto(n: number) {
    return `Q${n.toFixed(2)}`
  }

  const totalDetalles = pedidosFiltrados.reduce((acc, p) => acc + p.detalles.length, 0)
  const isLoading     = loading || loadingDetalles

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Cargando reportes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-sm text-destructive">No se pudo cargar el reporte. Intente de nuevo.</p>
        <p className="text-sm text-destructive">
          {error}
        </p>
        <button onClick={recargar} className="text-sm underline text-muted-foreground hover:text-foreground">
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Pedidos activos</h1>

      <div className="flex gap-2 mt-4 mb-2 justify-end">
        <PanelFiltros.Trigger
          abierto={abierto}
          onToggle={toggle}
          cantidadActivos={filtrosActivos.length}
        />
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="w-4 h-4" />
          Imprimir
        </Button>
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
      </PanelFiltros.Panel>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Pedidos activos</p>
          </div>
          <p className="text-2xl font-semibold">
            {meta.total}
          </p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Líneas de detalle</p>
          </div>
          <p className="text-2xl font-semibold">{totalDetalles}</p>
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between mb-3">
        <RecordCount count={pedidosFiltrados.length} />
        <button
          onClick={toggleTodos}
          className="print:hidden text-xs text-muted-foreground underline hover:text-foreground"
        >
          {todoExpandido ? "Colapsar todos" : "Expandir todos"}
        </button>
      </div>

      {/* Lista de pedidos */}
      {pedidosFiltrados.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <p className="text-sm text-muted-foreground">
            {filtrosActivos.length > 0 ? "Ningún pedido coincide con los filtros aplicados." : "No hay pedidos activos."}
          </p>
          {filtrosActivos.length > 0 && (
            <button onClick={limpiarFiltros} className="text-xs underline text-muted-foreground hover:text-foreground">
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {pedidosFiltrados.map(pedido => {
            const estaAbierto = expandidos.has(pedido.idPedido!)
            return (
              <div key={pedido.idPedido} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => togglePedido(pedido.idPedido!)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors"
                >
                  <span className="flex-1 text-sm font-medium truncate">{pedido.direccion}</span>
                  <span className="text-sm font-semibold shrink-0">{fmtMonto(pedido.subtotal)}</span>
                  {estaAbierto
                    ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                </button>
                <div className="grid grid-cols-3 gap-2 px-4 py-2 bg-muted/30 border-t text-xs">
                  <div>
                    <span className="text-muted-foreground">Albañil: </span>
                    <span className="font-medium">{pedido.nombreAlbanil || "No asignado"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Propietario: </span>
                    <span className="font-medium">{pedido.nombrePropietario || "No asignado"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Período: </span>
                    <span className="font-medium">
                      {formatFecha(pedido.fechaInicio)} – {formatFecha(pedido.fechaFin)}
                    </span>
                  </div>
                </div>
                {estaAbierto && (
                  <div className="border-t">
                    {pedido.detalles.length === 0 ? (
                      <p className="text-xs text-muted-foreground px-4 py-3">Sin detalles registrados.</p>
                    ) : (
                      <table className="w-full text-sm text-left divide-x divide-border">
                        <thead>
                          <tr className="bg-muted/30 text-xs text-muted-foreground divide-x divide-border">
                            <th className="px-4 py-2 font-medium">Cantidad</th>
                            <th className="px-4 py-2 font-medium">Material</th>
                            <th className="px-4 py-2 font-medium">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pedido.detalles.map(d => (
                            <tr key={d.idDetallePedido} className="border-t hover:bg-muted/20 divide-x divide-border">
                              <td className="px-4 py-2">{d.cantidad}</td>
                              <td className="px-4 py-2">{d.material}</td>
                              <td className="px-4 py-2 font-medium text-right">{fmtMonto(d.total || 0)}</td>
                            </tr>
                          ))}
                          <tr className="border-t">
                            <td colSpan={2} className="px-4 py-2 text-xs text-muted-foreground font-medium">
                              Subtotal pedido
                            </td>
                            <td className="px-4 py-2 font-semibold text-right">{fmtMonto(pedido.subtotal)}</td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <Paginacion
            page={page}
            totalPages={meta.totalPages > 0 ? meta.totalPages : Math.ceil((meta.total || 1) / 10)}
            onChange={setPage}
          />
    </div>
  )
}