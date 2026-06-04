import { useState } from "react"
import ReportePedidosActivos from "./ReportePedidosActivos"
import ReporteHistorialPedidos from "./ReporteHistorialPedidos"
import ReporteClientesActivos from "./ReporteClientesActivos"
import { ClipboardList, History, Users } from "lucide-react"

export default function ReporteMaestro() {
  const [tabActiva, setTabActiva] = useState<"activos" | "historial" | "clientes">("activos")

  return (
    <div className="space-y-6">
      {/* Selector de Pestañas Estilo Premium */}
      <div className="print:hidden border-b border-slate-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setTabActiva("activos")}
            className={`
              group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm gap-2 transition-all duration-200 cursor-pointer
              ${tabActiva === "activos"
                ? "border-amber-600 text-amber-700 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}
            `}
          >
            <ClipboardList className={`w-4 h-4 ${tabActiva === "activos" ? "text-amber-700" : "text-slate-400 group-hover:text-slate-500"}`} />
            Pedidos Activos
          </button>

          <button
            onClick={() => setTabActiva("historial")}
            className={`
              group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm gap-2 transition-all duration-200 cursor-pointer
              ${tabActiva === "historial"
                ? "border-amber-600 text-amber-700 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}
            `}
          >
            <History className={`w-4 h-4 ${tabActiva === "historial" ? "text-amber-700" : "text-slate-400 group-hover:text-slate-500"}`} />
            Historial de Pedidos
          </button>

          <button
            onClick={() => setTabActiva("clientes")}
            className={`
              group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm gap-2 transition-all duration-200 cursor-pointer
              ${tabActiva === "clientes"
                ? "border-amber-600 text-amber-700 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}
            `}
          >
            <Users className={`w-4 h-4 ${tabActiva === "clientes" ? "text-amber-700" : "text-slate-400 group-hover:text-slate-500"}`} />
            Clientes Activos
          </button>
        </nav>
      </div>

      {/* Renderizado Condicional del Reporte */}
      <div>
        {tabActiva === "activos" && <ReportePedidosActivos />}
        {tabActiva === "historial" && <ReporteHistorialPedidos />}
        {tabActiva === "clientes" && <ReporteClientesActivos />}
      </div>
    </div>
  )
}