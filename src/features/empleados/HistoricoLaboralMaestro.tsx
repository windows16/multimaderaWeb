import { useState } from "react"
import { getAllHistoricoEmpleados } from "../../services/empleados-service"
import type { HistoricoLaboral } from "../../types/Empleados/HistoricoLaboral"
import { formatFecha } from "../../utils/Functions"
import { FaFileExcel, FaBriefcase, FaCalendarAlt, FaEdit } from "react-icons/fa"
import HistoricoLaboralForm from "./HistoricoLaboralForm"
import { ExportToExcel } from "../../utils/ExportToExcel"
import { useFetch } from "@/hooks/useFetch"
import { useBusqueda } from "@/hooks/useBusqueda"
import CardGrid from "@/components/layout/CardGrid"
import MaestroLayout from "@/components/layout/MaestroLayout"

export default function HistoricoLaboralMaestro() {

  const { items: itemHistorial, error, recargar: obtenerHistorial, loading } = useFetch<HistoricoLaboral>(getAllHistoricoEmpleados)
  const { busqueda, setBusqueda, itemsFiltrados: historialFiltrado } = useBusqueda(itemHistorial)

  const [modalAbierto, setModalAbierto] = useState(false)
  const [historicoSeleccionado, setHistoricoSeleccionado] = useState<HistoricoLaboral | null>(null)

  return (
    <MaestroLayout
      title="Historial Laboral"
      menuOptions={[
        {
          label: "Exportar",
          icon: <FaFileExcel className="mr-2 text-green-600" />,
          onClick: () => ExportToExcel({
              data: historialFiltrado,
              fileName: "historial_laboral.xlsx",
              sheetName: "Historial",
              mapFn: (h) => ({
                "ID Historial": h.idHistorial,
                "No. Empleado": h.numeroDeEmpleado,
                "Empleado": h.nombreEmpleado,
                "Puesto": h.puesto || "N/A",
                "Tipo Movimiento": h.tipoMovimiento,
                "Fecha Inicio": formatFecha(h.fechaInicio),
                "Fecha Fin": h.fechaFin ? formatFecha(h.fechaFin) : "Actual",
                "Motivo": h.motivo,
              }),
            }),
        }
      ]}
      busqueda={busqueda}
      onBusquedaChange={setBusqueda}
      recordCount={loading ? 0 : historialFiltrado.length}
      error={error}
      loading={loading}
      onAgregar={() => { setHistoricoSeleccionado(null); setModalAbierto(true); }}
    >
      <CardGrid
        items={historialFiltrado}
        isLoading={loading}
        getKey={(item) => item.idHistorial ?? Math.random()}
        getTitulo={(item) => `${item.numeroDeEmpleado} - ${item.nombreEmpleado}`}
        cardOptions={[
          {
            label: "Editar",
            icon: <FaEdit className="text-blue-600" />,
            onClick: (item) => { setHistoricoSeleccionado(item); setModalAbierto(true); }
          }
        ]}
        renderContent={(item) => (
          <div className="mt-2 space-y-1" >
            <div className="flex items-center gap-1.5">
              <FaBriefcase className="text-amber-600" /> 
              <span className="font-medium text-gray-700">{item.puesto}</span>
            </div>
            <p className="text-sm">
                <span className="font-semibold text-gray-600">Movimiento:</span> <span className="text-blue-600 font-medium">{item.tipoMovimiento}</span>
            </p>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <FaCalendarAlt /> 
              <span>{formatFecha(item.fechaInicio)} - {item.fechaFin ? formatFecha(item.fechaFin) : "Presente"}</span>
            </div>
            <p className="text-sm mt-1 text-gray-600 italic">
                "{item.motivo}"
            </p>
          </div>
        )}
      />

      {/* MODAL */}
      <HistoricoLaboralForm
        isOpen={modalAbierto}
        onClose={() => { setModalAbierto(false); setHistoricoSeleccionado(null); }}
        onSuccess={obtenerHistorial}
        historicoEditar={historicoSeleccionado}
      />

    </MaestroLayout>
  )
}
