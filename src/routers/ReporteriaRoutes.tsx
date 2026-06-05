import { Route } from "react-router-dom"

import ReporteClientesActivos from "@/features/reporteria/ReporteClientesActivos"
import ReportePedidosActivos from "@/features/reporteria/ReportePedidosActivos"
import ReporteHistorialPedidos from "@/features/reporteria/ReporteHistorialPedidos"

export const ReporteriaRoutes = (
    <>
        <Route path="/reportes/clientes-activos" element={<ReporteClientesActivos />} />
        <Route path="/reportes/pedidos-activos" element={<ReportePedidosActivos />} />
        <Route path="/reportes/historial-pedidos" element={<ReporteHistorialPedidos />} />
    </>
)
