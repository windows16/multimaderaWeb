import { useState, useEffect, useMemo } from "react"
import { Printer, Users, Search, Phone, BarChart3 } from "lucide-react"
import { getAllClientes } from "@/services/clientes-service"
import type { Cliente } from "@/types/Clientes/Cliente"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePaginacion } from "@/hooks/usePaginacion"
import RecordCount from "@/components/common/RecordCount"
import { Paginacion } from "@/components/common/Paginacion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { getAllPedidos } from "@/services/pedidos-service"

async function fetchClientesPaginados(page: number, limit: number) {
  const respuesta = await getAllClientes(page, limit)
  return {
    data: respuesta.data || [],
    meta: respuesta.meta,
  }
}

export default function ReporteClientesActivos() {
  const [searchTerm, setSearchTerm] = useState("")
  const [clientesConPedidos, setClientesConPedidos] = useState<(Cliente & { pedidosCount: number })[]>([])
  const [loadingPedidos, setLoadingPedidos] = useState(false)

  const {
    items: clientes,
    loading,
    errorPaginacion,
    page,
    setPage,
    meta,
    recargar,
  } = usePaginacion<Cliente>({
    fetchFn: fetchClientesPaginados,
    initialLimit: 10,
  })

  // Obtener los pedidos para calcular cuántos tiene cada cliente en la página actual
  useEffect(() => {
    if (clientes.length === 0) {
      setClientesConPedidos([])
      return
    }
    let activo = true
    async function enriquecerClientes() {
      setLoadingPedidos(true)
      try {
        // Obtenemos una lista grande de pedidos para cruzar
        const resPedidos = await getAllPedidos(1, 100)
        const listaPedidos = resPedidos.data || []
        
        const enriquecidos = clientes.map(c => {
          // Buscamos cuántos pedidos pertenecen a este cliente (por propietario o albanil)
          const count = listaPedidos.filter(p => p.propietario === c.numeroDeCliente || p.albanil === c.numeroDeCliente).length
          return { ...c, pedidosCount: count }
        })

        if (activo) {
          setClientesConPedidos(enriquecidos)
        }
      } catch {
        if (activo) {
          setClientesConPedidos(clientes.map(c => ({ ...c, pedidosCount: 0 })))
        }
      } finally {
        setLoadingPedidos(false)
      }
    }
    enriquecerClientes()
    return () => { activo = false }
  }, [clientes])

  // Filtro local adicional de búsqueda
  const clientesFiltrados = useMemo(() => {
    return clientesConPedidos.filter(cliente => {
      const telefonoStr = cliente.telefono !== null && cliente.telefono !== undefined ? String(cliente.telefono) : "";
      const matchSearch = cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          telefonoStr.includes(searchTerm) ||
                          (cliente.tipoCliente && cliente.tipoCliente.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchSearch;
    })
  }, [clientesConPedidos, searchTerm])

  const totalClientes = meta.total || clientesFiltrados.length
  const isLoading = loading || loadingPedidos

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Cargando reporte de clientes...</p>
      </div>
    )
  }

  if (errorPaginacion) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-sm text-destructive">No se pudo cargar el reporte. Intente de nuevo.</p>
        <button onClick={recargar} className="text-sm underline text-muted-foreground hover:text-foreground">
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Reporte de Clientes Activos</h1>

      <div className="flex flex-col sm:flex-row gap-3 mt-4 mb-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, teléfono o tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Button variant="outline" onClick={() => window.print()} className="w-full sm:w-auto">
          <Printer className="w-4 h-4" />
          Imprimir Reporte
        </Button>
      </div>

      {/* Gráfica de Clientes con Mayor Cantidad de Pedidos */}
      {clientesFiltrados.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm mb-6 print:hidden">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-slate-800">Clientes con Mayor Cantidad de Pedidos</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={clientesFiltrados
                  .slice()
                  .sort((a, b) => b.pedidosCount - a.pedidosCount)
                  .slice(0, 5)
                  .map(c => ({
                    name: c.nombre.split(" ")[0] || c.nombre,
                    Pedidos: c.pedidosCount
                  }))}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} tickLine={false} width={80} />
                <Tooltip
                  formatter={(val) => [`${val} Pedidos`, "Cantidad"]}
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                />
                <Bar dataKey="Pedidos" radius={[0, 4, 4, 0]}>
                  {clientesFiltrados
                    .slice()
                    .sort((a, b) => b.pedidosCount - a.pedidosCount)
                    .slice(0, 5)
                    .map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "#2563eb" : "#3b82f6"} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-700">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-amber-800 font-medium">Clientes Activos Registrados</p>
            <p className="text-2xl font-bold text-amber-950">{totalClientes}</p>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between mb-3">
        <RecordCount count={clientesFiltrados.length} />
      </div>

      {/* Tabla de clientes */}
      {clientesFiltrados.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <p className="text-sm text-muted-foreground">
            Ningún cliente coincide con la búsqueda.
          </p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
          <table className="w-full text-sm text-left divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">No. Cliente</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre Completo</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo Cliente</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {clientesFiltrados.map((cliente) => (
                <tr key={cliente.numeroDeCliente} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                    #{cliente.numeroDeCliente}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">
                    {cliente.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {cliente.telefono || "Sin registrar"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                      {cliente.tipoCliente || "sin asignar"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4">
        <Paginacion
          page={page}
          totalPages={meta.totalPages > 0 ? meta.totalPages : Math.ceil((meta.total || 1) / 10)}
          onChange={setPage}
        />
      </div>
    </div>
  )
}
