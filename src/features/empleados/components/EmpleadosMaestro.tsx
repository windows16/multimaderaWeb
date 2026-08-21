
import { useState } from "react"
import { getAllEmpleados } from "../services/empleados-service"
import type { Empleado } from "../models/Empleado"
import { formatFecha } from "../../../utils/Functions"
import { FaEdit, FaUserMinus, FaFileExcel, FaPhone } from "react-icons/fa"
import EmpleadosForm from "./EmpleadosForm"
import BajaEmpleadosForm from "./BajaEmpleadosForm"
import HistoricoLaboralForm from "./HistoricoLaboralForm"
import type { HistoricoLaboral } from "../models/HistoricoLaboral"
import { ExportToExcel } from "../../../utils/ExportToExcel"
import { useFetch } from "@/hooks/useFetch"
import { useBusqueda } from "@/hooks/useBusqueda"
import CardGrid from "@/components/layout/CardGrid"
import MaestroLayout from "@/components/layout/MaestroLayout"

export default function EmpleadosMaestro() {

  const { items: itemEmpleados, error, recargar: obtenerEmpleados, loading } = useFetch<Empleado>(getAllEmpleados)
  const { busqueda, setBusqueda, itemsFiltrados: empleadosFiltrados } = useBusqueda(itemEmpleados)

  // Modal crear / editar
  const [modalEmpleadosAbierto, setModalEmpleadosAbierto] = useState(false)
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null)

  // Modal baja
  const [bajaModalAbierto, setBajaModalAbierto] = useState(false)
  const [empleadoParaBaja, setEmpleadoParaBaja] = useState<Empleado | null>(null)

  // Modal Historial
  const [modalHistorialAbierto, setModalHistorialAbierto] = useState(false)
  const [historicoPrellenado, setHistoricoPrellenado] = useState<HistoricoLaboral | null>(null)

  const handleAltaSuccess = async (empleadoForm?: Empleado, esEdicion?: boolean) => {
    obtenerEmpleados()
    // Solo mostramos el historial si es una creación nueva y tenemos los datos
    if (!esEdicion && empleadoForm) {
      
      let empId = empleadoForm.numeroDeEmpleado;
      if (!empId) {
        try {
            const empleadosList = await getAllEmpleados();
            const found = empleadosList.find(e => String(e.dpi) === String(empleadoForm.dpi));
            if (found) empId = found.numeroDeEmpleado;
        } catch (e) {
            console.error("Error buscando al empleado por DPI", e);
        }
      }

      setHistoricoPrellenado({
        idHistorial: 0,
        numeroDeEmpleado: empId || 0,
        idPuesto: 0,
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaFin: null,
        tipoMovimiento: "Alta",
        motivo: "Nuevo ingreso a la empresa",
        puesto: "",
        nombreEmpleado: empleadoForm.nombre || ""
      })
      setModalHistorialAbierto(true)
    }
  }

  const handleBajaSuccess = (empleado?: Empleado) => {
    obtenerEmpleados()
    if (empleado) {
      setHistoricoPrellenado({
        idHistorial: 0,
        numeroDeEmpleado: empleado.numeroDeEmpleado || 0,
        idPuesto: 0,
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaFin: new Date().toISOString().split('T')[0],
        tipoMovimiento: "Baja",
        motivo: "",
        puesto: "",
        nombreEmpleado: empleado.nombre || ""
      })
      setModalHistorialAbierto(true)
    }
  }


  return (
    <MaestroLayout
      title="Empleados"
      menuOptions={[
        {
          label: "Exportar",
          icon: <FaFileExcel className="mr-2 text-green-600" />,
          onClick: () => ExportToExcel({
              data: empleadosFiltrados,
              fileName: "empleados.xlsx",
              sheetName: "Empleados",
              mapFn: (emp) => ({
                "No. Empleado": emp.numeroDeEmpleado,
                "Nombre": emp.nombre,
                "Teléfono": emp.telefono,
                "Fecha Nacimiento": formatFecha(emp.fechaNacimiento),
                "DPI": emp.dpi,
              }),
            }),
        }
      ]}
      busqueda={busqueda}
      onBusquedaChange={setBusqueda}
      recordCount={loading ? 0 : empleadosFiltrados.length}
      error={error}
      loading={loading}
      onAgregar={() => { setEmpleadoSeleccionado(null); setModalEmpleadosAbierto(true) }}
    >
      <CardGrid
        items={empleadosFiltrados}
        isLoading={loading}
        getKey={(item) => item.numeroDeEmpleado ?? 0}
        getTitulo={(item) => `${item.numeroDeEmpleado} - ${item.nombre}`}
        cardOptions={[
          {
            label: "Editar",
            icon: <FaEdit className="w-3.5 h-3.5 mr-2" />,
            onClick: (item) => { setEmpleadoSeleccionado(item); setModalEmpleadosAbierto(true) }
          },
          {
            label: "Dar de baja",
            icon: <FaUserMinus className="w-3.5 h-3.5 mr-2" />,
            className: "text-red-500 focus:text-red-500 focus:bg-red-50",
            separator: true,
            onClick: (item) => { setEmpleadoParaBaja(item); setBajaModalAbierto(true) }
          }
        ]}
        renderContent={(item) => (
          <div className="mt-2 space-y-1" >
            <div className="flex items-center gap-1.5">
              <FaPhone className="text-blue-500" /> 
              <span>Tel: {item.telefono? item.telefono : "N/A"}</span>
            </div>
            <p>Fecha de Nacimiento: {formatFecha(item.fechaNacimiento)}</p>
            <p>DPI: {item.dpi}</p>
          </div>
        )}
      />

      {/* MODALES */}
      <EmpleadosForm
        isOpen={modalEmpleadosAbierto}
        onClose={() => { setModalEmpleadosAbierto(false); setEmpleadoSeleccionado(null) }}
        onSuccess={handleAltaSuccess}
        empleadoEditar={empleadoSeleccionado} />

      <BajaEmpleadosForm
        isOpen={bajaModalAbierto}
        onClose={() => { setBajaModalAbierto(false); setEmpleadoParaBaja(null) }}
        onSuccess={handleBajaSuccess}
        empleado={empleadoParaBaja} />

      <HistoricoLaboralForm
        isOpen={modalHistorialAbierto}
        onClose={() => { setModalHistorialAbierto(false); setHistoricoPrellenado(null); }}
        onSuccess={() => {}}
        historicoEditar={historicoPrellenado} // Lo pasamos como "edición" para que use los valores, pero el ID será null/0
      />

    </MaestroLayout>
  )
}